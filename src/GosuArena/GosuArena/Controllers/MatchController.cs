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
            var bots = FileBotRepository.GetAll();

            return PlayMatch(bots.Select(x => x.Id).ToList());
        }

        public ActionResult Setup()
        {
            var bots = BotRepository.GetAll();

            return View("Setup", bots);
        }

        public ActionResult Play(string names)
        {
            var botNames = names.Split(',', ';');

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
    }
}