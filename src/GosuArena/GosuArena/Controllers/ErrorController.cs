using System;
using System.Web.Mvc;

namespace GosuArena.Controllers
{
    public class ErrorController : BaseController
    {
        [Authorize(Users = "erikojebo")]
        public ActionResult Create()
        {
            throw new InvalidOperationException();
        }
    }
}