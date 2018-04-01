using System;

namespace angular_log_lib_web_api.Models
{
    public class LogEntry
    {
        public DateTime EntryDate { get; set; }
        public string Message { get; set; }

        public LogLevel Level { get; set; }
        public object[] ExtraInfo { get; set; }
    }
}