# n-job

A powerful and flexible job scheduling and execution library for Node.js applications.

## Features

- Two types of jobs:
  - **Scheduled Jobs**: Execute at specific times or on specific schedules (e.g., every Monday at 9 AM)
  - **Timed Jobs**: Execute repeatedly at fixed intervals (e.g., every 5 minutes)
- Support for timezone-aware scheduling
- Job management and monitoring capabilities
- TypeScript support
- Built with modern Node.js features

## Installation

```bash
npm install @nivinjoseph/n-job
# or
yarn add @nivinjoseph/n-job
```

## Requirements

- Node.js >= 20.10
- TypeScript (optional, but recommended)

## Usage

### Basic Setup

```typescript
import { JobManager, Schedule, ScheduleDateTimeZone, ScheduledJob, TimedJob } from "@nivinjoseph/n-job";
import { inject } from "@nivinjoseph/n-ject";
import type { Logger } from "@nivinjoseph/n-log";

// Create a job manager instance
const jobManager = new JobManager();

// Define a timed job
@inject("Logger")
export class TimedTestJob extends TimedJob
{
    public constructor(logger: Logger)
    {
        super(logger, Duration.fromMinutes(10) as any);
    }

    protected async run(): Promise<void>
    {
        await this.logger.logInfo("This is a test timed job running every 10 minutes");
    }
}

// Register and start jobs
jobManager.registerJobs(TimedTestJob);
jobManager.bootstrap();
jobManager.beginJobs();
```

### Schedule Configuration

The `Schedule` class allows you to create flexible schedules for your jobs. You can combine different time components to create the exact schedule you need.

#### Time Components

You can set the following time components in any order:

```typescript
const schedule = new Schedule()
    .setTimeZone(ScheduleDateTimeZone.utc)  // Set timezone
    .setMonth(12)                           // December (1-12)
    .setDayOfMonth(31)                      // 31st day of month (1-31)
    .setDayOfWeek(1)                        // Monday (1-7, where 1 is Monday)
    .setHour(14)                            // 2 PM (0-23)
    .setMinute(30);                         // 30 minutes (0-59)
```

#### Schedule Patterns

1. **Daily Schedule**
   ```typescript
   // Run every day at 2:30 PM UTC
   const dailySchedule = new Schedule()
       .setTimeZone(ScheduleDateTimeZone.utc)
       .setHour(14)
       .setMinute(30);
   ```

2. **Weekly Schedule**
   ```typescript
   // Run every Monday at 9:00 AM PST
   const weeklySchedule = new Schedule()
       .setTimeZone(ScheduleDateTimeZone.pst)
       .setDayOfWeek(1)  // 1 = Monday
       .setHour(9)
       .setMinute(0);
   ```

3. **Monthly Schedule**
   ```typescript
   // Run on the 1st of every month at midnight EST
   const monthlySchedule = new Schedule()
       .setTimeZone(ScheduleDateTimeZone.est)
       .setDayOfMonth(1)
       .setHour(0)
       .setMinute(0);
   ```

4. **Specific Date and Time**
   ```typescript
   // Run on December 31st at 11:59 PM UTC
   const specificSchedule = new Schedule()
       .setTimeZone(ScheduleDateTimeZone.utc)
       .setMonth(12)
       .setDayOfMonth(31)
       .setHour(23)
       .setMinute(59);
   ```

#### Important Notes

1. **Recurring Schedules**: 
   - If you don't set `month` and `dayOfMonth`, the schedule will repeat at the specified time every day
   - If you set `dayOfWeek` but not `month` and `dayOfMonth`, it will repeat weekly
   - If you set `month` and `dayOfMonth`, it will repeat yearly

2. **Time Components**:
   - `dayOfWeek` and `dayOfMonth` are mutually exclusive - you can't set both
   - All time components are optional except `hour` and `minute`
   - If you don't set `timeZone`, it defaults to the local timezone

3. **Validation**:
   - The library validates that the day of month exists for the specified month
   - For February 29th, it handles leap years automatically

### Scheduled Jobs

Scheduled jobs execute at specific times or on specific schedules. They use the `Schedule` class to define when they should run.

#### Example: Daily Report Job

```typescript
import { inject } from "@nivinjoseph/n-ject";
import { Schedule, ScheduleDateTimeZone, ScheduledJob } from "@nivinjoseph/n-job";
import type { Logger } from "@nivinjoseph/n-log";

@inject("Logger")
export class DailyReportJob extends ScheduledJob
{
    public constructor(logger: Logger)
    {
        super(logger, new Schedule()
            .setTimeZone(ScheduleDateTimeZone.utc)
            .setHour(8)    // 8 AM
            .setMinute(0)  // 00 minutes
        );
    }

    protected async run(): Promise<void>
    {
        await this.logger.logInfo("Generating daily report...");
        // Add your report generation logic here
    }
}

// Register the job with the job manager
jobManager.registerJobs(DailyReportJob);
```

### Job Management

```typescript
// Register multiple jobs
jobManager.registerJobs(TimedTestJob, DailyReportJob);

// Bootstrap the job manager
jobManager.bootstrap();

// Start all registered jobs
jobManager.beginJobs();

// Clean up when done
await jobManager.dispose();
```

## API Reference

### JobManager

The main class for managing jobs and schedules.

#### Constructor

- `JobManager(container?: Container)` - Optional container for dependency injection

#### Properties

- `containerRegistry: Registry` - Access to the container registry
- `serviceLocator: ServiceLocator` - Access to the service locator

#### Methods

- `useInstaller(installer: ComponentInstaller): this` - Add a component installer
- `registerJobs(...jobClasses: ReadonlyArray<ClassHierarchy<Job>>): this` - Register job classes
- `bootstrap(): void` - Initialize the job manager and resolve dependencies
- `beginJobs(): Promise<void>` - Start all registered jobs
- `dispose(): Promise<void>` - Clean up resources

### Schedule

Class for creating job schedules.

#### Methods

- `setTimeZone(value: ScheduleDateTimeZone): this`
- `setMinute(value: number): this` - [0-59]
- `setHour(value: number): this` - [0-23]
- `setDayOfWeek(value: number): this` - [1-7] where 1 is Monday and 7 is Sunday
- `setDayOfMonth(value: number): this` - [1-31]
- `setMonth(value: number): this` - [1-12]

### ScheduleDateTimeZone

Enum for supported timezones:
- `utc`
- `local`
- `est` (Eastern Time)
- `pst` (Pacific Time)

### ScheduledJob

Base class for scheduled jobs.

#### Constructor

- `ScheduledJob(logger: Logger, schedule: Schedule)`

#### Methods

- `protected run(): Promise<void>` - Override this method to implement job logic

### TimedJob

Base class for timed jobs.

#### Constructor

- `TimedJob(logger: Logger, intervalInMs: number)`

#### Methods

- `protected run(): Promise<void>` - Override this method to implement job logic

## Error Handling

The library provides custom exceptions for handling scheduling errors:

```typescript
import { InvalidScheduleException } from "@nivinjoseph/n-job";

try {
    // Schedule job
} catch (error) {
    if (error instanceof InvalidScheduleException) {
        // Handle invalid schedule
    }
}
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
