using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using GosuArena.Entities;
using GosuArena.Services;

namespace GosuArena.Controllers
{
    public class MatchController : BaseController
    {
        public ActionResult Index()
        {
            var bots = Repository.Find<Bot>()
                .Where(x => x.IsTrainer || x.IsDemoBot)
                .ExecuteList();

            return PlayMatch(bots);
        }

        public ActionResult Setup()
        {
            var bots = Repository.Find<Bot>()
                .Where(x => !x.IsDemoBot)
                .Join(x => x.User)
                .OrderBy(x => x.Name)
                .ExecuteList();

            return View("Setup", bots);
        }

        public ActionResult Play(string names)
        {
            var botNames = names.Split(',', ';');

            var bots = Repository.Find<Bot>()
                .Where(x => botNames.Contains(x.Name))
                .ExecuteList();

            return PlayMatch(bots);
        }

        private ActionResult PlayMatch(IList<Bot> bots)
        {
            return View("Play", bots);
        }
    }
}