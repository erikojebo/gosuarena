using System.Web.Mvc;

namespace GosuArena.Controllers
{
    public class AccountController : Controller
    {
        //    private readonly Repository _repository = new Repository();

        //    public ActionResult Login()
        //    {
        //        return View();
        //    }

        //    [HttpPost]
        //    public ActionResult Login(LogOnModel model, string returnUrl)
        //    {
        //        if (ModelState.IsValid)
        //        {
        //            if (IsValid(model.UserName, model.Password))
        //            {
        //                UpdateLastLoginDate(model.UserName);

        //                FormsAuthentication.SetAuthCookie(model.UserName, model.RememberMe);

        //                return RedirectToReturnUrl(returnUrl);
        //            }

        //            ModelState.AddModelError("", "The user name or password provided is incorrect.");
        //        }

        //        // If we got this far, something failed, redisplay form
        //        return View(model);
        //    }

        //    private ActionResult RedirectToReturnUrl(string returnUrl)
        //    {
        //        if (Url.IsLocalUrl(returnUrl) && returnUrl.Length > 1 && returnUrl.StartsWith("/")
        //            && !returnUrl.StartsWith("//") && !returnUrl.StartsWith("/\\"))
        //        {
        //            return Redirect(returnUrl);
        //        }

        //        return RedirectToAction("Page", "Code");
        //    }

        //    private void UpdateLastLoginDate(string userName)
        //    {
        //        _repository.Update<User>()
        //                   .Set(x => x.LastLoginDate, DateTime.Now)
        //                   .Where(
        //                       x => x.Username == userName).Execute();
        //    }

        //    private bool IsValid(string username, string password)
        //    {
        //        var user = _repository.Find<User>()
        //                              .Where(x => x.Username == username)
        //                              .ExecuteList()
        //                              .FirstOrDefault();

        //        if (user == null)
        //            return false;

        //        return AuthenticationService.IsValid(user, username, password);
        //    }

        //    //
        //    // GET: /Account/LogOff

        //    public ActionResult LogOff()
        //    {
        //        FormsAuthentication.SignOut();

        //        return RedirectToAction("Page", "Code");
        //    }

        //    [Authorize]
        //    public ActionResult ChangePassword()
        //    {
        //        return View();
        //    }

        //    //
        //    // POST: /Account/ChangePassword

        //    [Authorize]
        //    [HttpPost]
        //    public ActionResult ChangePassword(ChangePasswordModel model)
        //    {
        //        if (ModelState.IsValid)
        //        {
        //            // ChangePassword will throw an exception rather
        //            // than return false in certain failure scenarios.
        //            bool changePasswordSucceeded;
        //            try
        //            {
        //                var users = _repository.Find<User>().Where(x => x.Username == User.Identity.Name &&
        //                                                                x.HashedPassword == Md5Hasher.Hash(model.OldPassword, CompatibilityMode.PHP))
        //                                       .ExecuteList();


        //                if (users.Any())
        //                {
        //                    users.First().HashedPassword = Md5Hasher.Hash(model.NewPassword, CompatibilityMode.PHP);
        //                    _repository.Update(users.First());

        //                    changePasswordSucceeded = true;
        //                }
        //                else
        //                {
        //                    changePasswordSucceeded = false;
        //                }
        //            }
        //            catch (Exception)
        //            {
        //                changePasswordSucceeded = false;
        //            }

        //            if (changePasswordSucceeded)
        //            {
        //                return RedirectToAction("ChangePasswordSuccess");
        //            }
        //            else
        //            {
        //                ModelState.AddModelError("", "The current password is incorrect or the new password is invalid.");
        //            }
        //        }

        //        // If we got this far, something failed, redisplay form
        //        return View(model);
        //    }

        //    //
        //    // GET: /Account/ChangePasswordSuccess

        //    public ActionResult ChangePasswordSuccess()
        //    {
        //        return View();
        //    }

        //    [AdminAuthorize]
        //    public ActionResult Users()
        //    {
        //        var users = _repository.Find<User>()
        //            .OrderBy(x => x.FirstName, x => x.LastName)
        //            .ExecuteList();

        //        return View(users);
        //    }

        //    [AdminAuthorize]
        //    public ActionResult ConfirmResetPassword(int userId)
        //    {
        //        var user = _repository.Find<User>().Where(x => x.Id == userId).Execute();

        //        return View(user);
        //    }

        //    [AdminAuthorize]
        //    [HttpPost]
        //    public ActionResult ResetPassword(int userId)
        //    {
        //        var user = _repository.Find<User>().Where(x => x.Id == userId).Execute();

        //        var newPassword = CreateNewPassword(user);

        //        _repository.Update(user);

        //        SetSuccessMessageForRedirectResponse(string.Format("Lösenordet för användaren '{0}' har återställts till '{1}'", user.Username, newPassword));

        //        return RedirectToAction("Users");
        //    }

        //    [AdminAuthorize]
        //    public ActionResult Create()
        //    {
        //        return View(new AddUserModel());
        //    }

        //    [AdminAuthorize]
        //    [HttpPost]
        //    public ActionResult Create(AddUserModel model)
        //    {
        //        if (!ModelState.IsValid)
        //        {
        //            return View(model);
        //        }

        //        var user = Mapper.Map<User>(model);

        //        var existingUser = _repository.Find<User>().Where(x => x.Username == model.Username).Execute();

        //        if (existingUser != null)
        //        {
        //            AddValidationError<AddUserModel>(x => x.Username, "Användarnamnet används redan av en annan användare");
        //            return View(model);
        //        }

        //        var password = CreateNewPassword(user);

        //        _repository.Insert(user);

        //        SetSuccessMessageForRedirectResponse(string.Format("Användaren '{0}' har skapats med lösenord '{1}'", user.Username, password));

        //        return RedirectToAction("Users");
        //    }

        //    private static string CreateNewPassword(User user)
        //    {
        //        var newPassword = Membership.GeneratePassword(8, 0);

        //        user.HashedPassword = Md5Hasher.Hash(newPassword, CompatibilityMode.PHP);
        //        return newPassword;
        //    }
        //}
    }
}