using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SocialMediaApp.Api.Data;
using SocialMediaApp.Api.Models;

namespace SocialMediaApp.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _db;

        public UsersController(AppDbContext db)
        {
            _db = db;
        }

        [HttpGet("me")]
        [Authorize]
        public IActionResult Me()
        {
            var idClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value
                          ?? User.FindFirst(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub)?.Value;
            if (!int.TryParse(idClaim, out var id)) return Unauthorized();

            var user = _db.Users.Find(id);
            if (user == null) return NotFound();
            return Ok(new { user.Id, user.UserName, user.DisplayName, user.Email, user.Bio, user.CreatedAt });
        }

        [HttpGet("{id:int}")]
        public IActionResult Get(int id)
        {
            var user = _db.Users.Find(id);
            if (user == null) return NotFound();
            return Ok(new { user.Id, user.UserName, user.DisplayName, user.Bio, user.CreatedAt });
        }

        [HttpPost("{id:int}/follow")]
        [Authorize]
        public async Task<IActionResult> Follow(int id)
        {
            var followerId = GetCurrentUserId();
            if (followerId == null) return Unauthorized();
            if (followerId == id) return BadRequest("Cannot follow yourself");

            var target = _db.Users.Find(id);
            if (target == null) return NotFound();

            if (_db.Follows.Any(f => f.FollowerId == followerId && f.FollowingId == id))
                return BadRequest("Already following");

            var follow = new Follow { FollowerId = followerId.Value, FollowingId = id };
            _db.Follows.Add(follow);
            await _db.SaveChangesAsync();
            return Ok();
        }

        [HttpPost("{id:int}/unfollow")]
        [Authorize]
        public async Task<IActionResult> Unfollow(int id)
        {
            var followerId = GetCurrentUserId();
            if (followerId == null) return Unauthorized();

            var f = _db.Follows.FirstOrDefault(x => x.FollowerId == followerId && x.FollowingId == id);
            if (f == null) return BadRequest("Not following");
            _db.Follows.Remove(f);
            await _db.SaveChangesAsync();
            return Ok();
        }

        private int? GetCurrentUserId()
        {
            var idClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value
                          ?? User.FindFirst(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub)?.Value;
            if (int.TryParse(idClaim, out var id)) return id;
            return null;
        }
    }
}
