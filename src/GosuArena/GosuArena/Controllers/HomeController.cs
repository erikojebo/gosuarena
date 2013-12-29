using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using GosuArena.Entities;
using GosuArena.Models;
using GosuArena.Services;

namespace GosuArena.Controllers
{
    public class HomeController : BaseController
    {
        private FileBotRepository _fileBotRepository;
        private BotRepository _botRepository;

        public ActionResult Index()
        {
            var bots = FileBotRepository.GetAll();

            return PlayMatch(bots.Select(x => x.Id).ToList());
        }

        public ActionResult Users()
        {
            var users = Repository.Find<User>().ExecuteList();
            return Content(string.Join(", ", users.Select(x => x.Username)));
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

        public ActionResult SetupMatch()
        {
            var bots = BotRepository.GetAll();

            return View("SetupMatch", bots);
        }

        public ActionResult Play(string names)
        {
            var botNames = names.Split(',', ';', '&');
            var botIds = Repository.Find<Bot>()
                .Select(x => x.Id)
                .Where(x => botNames.Contains(x.Name))
                .ExecuteScalarList<int>();

            return PlayMatch(botIds);
        }

        private ActionResult PlayMatch(IList<int> botIds)
        {
            var bots = BotRepository.GetAll().Where(x => botIds.Contains(x.Id)).ToList();

            return View("Play", bots);
        }

        public FileBotRepository FileBotRepository
        {
            get
            {
                if (_fileBotRepository == null)
                    _fileBotRepository = new FileBotRepository(Server.MapPath("~/Scripts/bots/"));

                return _fileBotRepository;
            }
        }

        public BotRepository BotRepository
        {
            get
            {
                if (_botRepository == null)
                    _botRepository = new BotRepository(FileBotRepository);

                return _botRepository;
            }
        }
    }
}
