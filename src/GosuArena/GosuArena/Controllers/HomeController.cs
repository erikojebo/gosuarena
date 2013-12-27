using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Compilation;
using System.Web.Mvc;
using WeenyMapper;

namespace GosuArena.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            var connectionString = ConfigurationManager.ConnectionStrings["GosuArena"];
            var repository = new Repository();

            return View();
        }
    }
}
