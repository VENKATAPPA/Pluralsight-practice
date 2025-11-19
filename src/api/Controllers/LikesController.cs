using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SocialMediaApp.Api.Data;
using SocialMediaApp.Api.Models;

namespace SocialMediaApp.Api.Controllers
{
    [ApiController]
    [Route("api/posts/{postId:int}/[controller]")]
    public class LikesController : ControllerBase
    {
        private readonly AppDbContext _db;

        public LikesController(AppDbContext db)
        {
            _db = db;
        }

        [HttpPost("like")]
        [Authorize]
        public async Task<IActionResult> Like(int postId)
        {
            var userId = GetCurrentUserId();
            if (userId == null) return Unauthorized();

            var post = _db.Posts.Find(postId);
            if (post == null) return NotFound("Post not found");

            if (_db.Likes.Any(l => l.PostId == postId && l.UserId == userId))
                return BadRequest("Already liked");

            var like = new Like { PostId = postId, UserId = userId.Value };
            _db.Likes.Add(like);
            await _db.SaveChangesAsync();
            return Ok();
        }

        [HttpPost("unlike")]
        [Authorize]
        public async Task<IActionResult> Unlike(int postId)
        {
            var userId = GetCurrentUserId();
            if (userId == null) return Unauthorized();

            var like = _db.Likes.FirstOrDefault(l => l.PostId == postId && l.UserId == userId);
            if (like == null) return BadRequest("Not liked");

            _db.Likes.Remove(like);
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
