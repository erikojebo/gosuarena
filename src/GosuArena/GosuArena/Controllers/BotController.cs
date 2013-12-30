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
        public ActionResult Edit(int id)
        {
            var bot = GetBotWithUser(id);

            if (bot == null)
                return new HttpNotFoundResult();
            if (!IsBotOwnedByCurrentUser(bot))
                return new HttpUnauthorizedResult();

            return View(bot);
        }

        [HttpPost]
        public ActionResult Edit(Bot bot)
        {
            var existingBot = GetBotWithUser(bot.Id);
        
            if (existingBot == null)
                return new HttpNotFoundResult();
            if (!IsBotOwnedByCurrentUser(existingBot))
                return new HttpUnauthorizedResult();

            existingBot.Script = bot.Script;

            Repository.Update(existingBot);

            return RedirectToAction("Edit", new { id = bot.Id });
        }

        private Bot GetBotWithUser(int id)
        {
            return Repository
                .Find<Bot>().Where(x => x.Id == id)
                .Join(x => x.User)
                .Execute();
        }

        private bool IsBotOwnedByCurrentUser(Bot bot)
        {
            return bot.User != null && bot.User.Username == User.Identity.Name;
        }

        public ActionResult Create()
        {
            return View(new Bot());
        }

        [HttpPost]
        public ActionResult Create(Bot bot)
        {
            var existingBot = Repository
                .Find<Bot>()
                .Where(x => x.Name == bot.Name)
                .Select(x => x.Name)
                .Execute();

            if (existingBot != null)
            {
                ModelState.AddModelError("", "The is already a bot with the given name");
                return View(bot);
            }

            var userId = GetCurrentUserId();

            bot.UserId = userId;

            Repository.Insert(bot);

            return RedirectToAction("MyProfile", "User");
        }

        [HttpPost]
        public ActionResult Delete(int id)
        {
            var bot = GetBotWithUser(id);

            if (bot == null)
                return new HttpNotFoundResult();
            if (!IsBotOwnedByCurrentUser(bot))
                return new HttpUnauthorizedResult();

            Repository.Delete(bot);

            return RedirectToAction("MyProfile", "User");
        }
    }
}
