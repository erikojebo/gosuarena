using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using GosuArena.Entities;

namespace GosuArena.Controllers
{
    public class BotController : BaseController
    {
        public ActionResult Index(int id)
        {
            return View();
        }

        public ActionResult Edit(int id)
        {
            var bot = Repository.Find<Bot>().Where(x => x.Id == id).Execute();

            if (bot == null)
                return new HttpNotFoundResult();

            return View(bot);
        }

        public ActionResult Create()
        {
            return View(new Bot());
        }

        [HttpPost]
        public ActionResult Create(Bot bot)
        {
            var userId = GetCurrentUserId();

            bot.UserId = userId;

            Repository.Insert(bot);

            return RedirectToAction("MyProfile", "Home");
        }

        [HttpPost]
        public ActionResult Delete(int id)
        {
            throw new NotImplementedException();
        }
    }
}
