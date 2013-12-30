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
    public class UserController : BaseController
    {
        [Authorize]
        public ActionResult MyProfile()
        {
            var username = User.Identity.Name;

            return RedirectToAction("Profile", new { username = username });
        }

        [Authorize]
        public ActionResult Profile(string username)
        {
            var user = GetUserWithBots(username);

            if (user == null)
            {
                return new HttpNotFoundResult();
            }

            var isCurrentUserProfile = username == User.Identity.Name;

            if (isCurrentUserProfile)
                return View(user);

            return View("ReadOnlyProfile", user);
        }
    }
}
