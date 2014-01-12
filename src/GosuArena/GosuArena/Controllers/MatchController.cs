using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using GosuArena.Entities;
using GosuArena.Models.Match;

namespace GosuArena.Controllers
{
    public class MatchController : BaseController
    {
        public ActionResult Index()
        {
            var bots = Repository.Find<Bot>()
                .Where(x => x.IsTrainer || x.IsDemoBot)
                .Join<User, Bot>(x => x.Bots, x => x.User)
                .ExecuteList();

            return PlayMatch(bots);
        }

        [Authorize]
        public ActionResult Setup()
        {
            var bots = Repository.Find<Bot>()
                .Where(x => !x.IsDemoBot && x.IsPublic)
                .Join(x => x.User)
                .OrderBy(x => x.Name)
                .ExecuteList();

            return View(bots);
        }

        [Authorize]
        public ActionResult Play(string names)
        {
            var botNames = names.Split(',', ';');

            var currentUserId = GetCurrentUserId();

            var bots = Repository.Find<Bot>()
                .Where(x => botNames.Contains(x.Name) && (x.IsPublic || x.UserId == currentUserId))
                .Join<User, Bot>(x => x.Bots, x => x.User)
                .ExecuteList();

            var matchIncludesPrivateBots = bots.Any(x => !x.IsPublic);
            var matchIncludesBotsWrittenByAnotherUser = bots.Any(x => !x.IsTrainer && x.UserId != currentUserId);

            if (matchIncludesPrivateBots && matchIncludesBotsWrittenByAnotherUser)
            {
                return Error(
                    "Your private bots are not allowed to participate in matches which include " +
                    "bots written by other users. Make your bot public again to enable facing " +
                    "other users' bots. Read the 'Private and Public Bots' section of the documentation " +
                    "for more information");
            }

            return PlayMatch(bots);
        }

        private ActionResult PlayMatch(IEnumerable<Bot> bots)
        {
            var botModels = bots.Select(x => new BotModel(x)).ToList();

            return PlayMatch(botModels);
        }

        private ActionResult PlayMatch(IList<BotModel> botModels)
        {
            return View("Play", botModels);
        }
    }
}