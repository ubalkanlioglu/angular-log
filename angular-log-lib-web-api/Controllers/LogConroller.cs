using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using angular_log_lib_web_api.Models;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

namespace angular_log_lib_web_api.Controllers
{
    [Route("api/[controller]")]
    public class LogController : Controller
    {
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        [HttpGet("GetTodo/{id}")]
        public IActionResult Get(long id)
        {
            return new ObjectResult(id);
        }


        [HttpPost]
        public IActionResult Post([FromBody] LogEntry value)
        {
            IActionResult result;

            result = Ok(value);

            return result;
        }

        [Route("post2")]
[HttpPost]
        public IActionResult Post2([FromBody] LogEntry value)
        {
            IActionResult result;

            result = Ok("value.vvvvvvvvvv");

            return result;
        }

    }

}
