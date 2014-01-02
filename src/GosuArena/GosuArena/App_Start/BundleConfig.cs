using System.Web.Optimization;

namespace GosuArena
{
    public class BundleConfig
    {
        // For more information on Bundling, visit http://go.microsoft.com/fwlink/?LinkId=254725
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/lib/jquery/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryvalidation").Include(
                        "~/Scripts/lib/jquery/jquery.unobtrusive*",
                        "~/Scripts/lib/jquery/jquery.validate*"));

#if !DEBUG
            BundleTable.EnableOptimizations = true;
#endif

            bundles.Add(new ScriptBundle("~/bundles/gosuarena").Include(
                "~/Scripts/gosu/math/math.js",
                "~/Scripts/gosu/math/point.js",
                "~/Scripts/gosu/math/vector.js",
                "~/Scripts/gosu/math/line.js",
                "~/Scripts/gosu/math/rectangle.js",
                "~/Scripts/gosu/snapshot.js",
                "~/Scripts/gosu/eventAggregator.js",
                "~/Scripts/rectangleCache.js",
                "~/Scripts/events.js",
                "~/Scripts/bot.js",
                "~/Scripts/bullet.js",
                "~/Scripts/botOptions.js",
                "~/Scripts/collisionDetector.js",
                "~/Scripts/actionQueue.js",
                "~/Scripts/userActionQueue.js",
                "~/Scripts/gameVisualizer.js",
                "~/Scripts/arenaState.js",
                "~/Scripts/gameClock.js",
                "~/Scripts/engine.js",
                "~/Scripts/settings.js",
                "~/Scripts/legend.js"));
        }
    }
}