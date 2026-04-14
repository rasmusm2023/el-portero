using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using ElPortero.Api.Models;
using Microsoft.IdentityModel.Tokens;

namespace ElPortero.Api;

public static class AuthToken
{
  public const string CookieName = "elportero_admin";

  public static SymmetricSecurityKey CreateSigningKey(IConfiguration config)
  {
    var key = config["Auth:JwtSigningKey"] ?? "";
    if (string.IsNullOrWhiteSpace(key))
    {
      throw new InvalidOperationException("Missing Auth:JwtSigningKey configuration.");
    }
    return new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
  }

  public static string CreateJwt(IConfiguration config, StaffUser user)
  {
    var creds = new SigningCredentials(CreateSigningKey(config), SecurityAlgorithms.HmacSha256);
    var claims = new List<Claim>
    {
      new(JwtRegisteredClaimNames.Sub, user.Username),
      new(ClaimTypes.Name, user.Username),
      new(ClaimTypes.Role, user.Role),
    };

    var token = new JwtSecurityToken(
      claims: claims,
      expires: DateTime.UtcNow.AddDays(7),
      signingCredentials: creds);

    return new JwtSecurityTokenHandler().WriteToken(token);
  }
}

