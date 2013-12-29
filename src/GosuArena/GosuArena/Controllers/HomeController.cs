using System;
using System.Linq;
using System.Web.Mvc;
using GosuArena.Entities;
using GosuArena.Models;
using GosuArena.Services;

namespace GosuArena.Controllers
{
    public class HomeController : BaseController
    {
        private FileBotRepository _botRepository;

        public ActionResult Index()
        {
            _botRepository = new FileBotRepository(Server.MapPath("~/Scripts/bots/"));

            var bots = _botRepository.GetAll();

            return View(bots);
        }

        public ActionResult Users()
        {
            var users = Repository.Find<User>().ExecuteList();
            return Content(string.Join(", ", users.Select(x => x.Username)));
        }

        public ActionResult Error()
        {
            throw new InvalidOperationException();
        }

        [Authorize]
        public ActionResult MyProfile()
        {
            var username = User.Identity.Name;

            var user = GetUserWithBots(username);

            if (user == null)
            {
                return new HttpNotFoundResult();
            }

            return View(user);
        }

        [Authorize]
        public ActionResult Profile(string username)
        {
            var user = GetUserWithBots(username);

            if (user == null)
            {
                return new HttpNotFoundResult();
            }

            return View(user);
        }

        public ActionResult Play()
        {
            throw new NotImplementedException();
        }
    }
}
