using System.Collections;
using System.Collections.Generic;
using System.Linq;
using GosuArena.Entities;

namespace GosuArena.Models.Match
{
    public class MatchSetupModel
    {
        public MatchSetupModel(IEnumerable<Bot> bots)
        {
            Bots = bots.Select(x => new BotModel(x)).ToList();
        }

        public int MaxTeamCount { get; set; }
        public IList<BotModel> Bots { get; set; }
    }
}