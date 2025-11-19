using DbUp;
using System;

// Get connection string from multiple sources with fallback hierarchy:
// 1. Command line argument
// 2. Environment variable (DB_CONNECTION_STRING)
// 3. .env file (if exists)
// 4. Default connection string
var connectionString = GetConnectionString(args);

if (string.IsNullOrWhiteSpace(connectionString))
{
    Console.ForegroundColor = ConsoleColor.Red;
    Console.WriteLine("Error: No connection string provided. Please provide one via:");
    Console.WriteLine("  1. Command line argument: dotnet run \"Server=...\"");
    Console.WriteLine("  2. Environment variable: DB_CONNECTION_STRING");
    Console.WriteLine("  3. .env file in the application directory");
    Console.ResetColor();
    Environment.Exit(-1);
}

Console.WriteLine($"Using connection string: {MaskConnectionString(connectionString)}");

var upgrader = DeployChanges.To
    .SqlDatabase(connectionString)
    .WithScriptsEmbeddedInAssembly(System.Reflection.Assembly.GetExecutingAssembly())
    .LogToConsole()
    .Build();

var result = upgrader.PerformUpgrade();

if (!result.Successful)
{
    Console.ForegroundColor = ConsoleColor.Red;
    Console.WriteLine(result.Error);
    Console.ResetColor();
    Environment.Exit(-1);
}

Console.ForegroundColor = ConsoleColor.Green;
Console.WriteLine("Success!");
Console.ResetColor();
Environment.Exit(0);

// Helper method to get connection string from multiple sources
string GetConnectionString(string[] args)
{
    // 1. Check command line arguments
    if (args.Length > 0 && !string.IsNullOrWhiteSpace(args[0]))
    {
        return args[0];
    }

    // 2. Check environment variable
    var envConnectionString = Environment.GetEnvironmentVariable("DB_CONNECTION_STRING");
    if (!string.IsNullOrWhiteSpace(envConnectionString))
    {
        return envConnectionString;
    }

    // 3. Check for .env file
    var envFilePath = Path.Combine(AppContext.BaseDirectory, ".env");
    if (File.Exists(envFilePath))
    {
        foreach (var line in File.ReadAllLines(envFilePath))
        {
            // Skip empty lines and comments
            var trimmedLine = line.Trim();
            if (string.IsNullOrWhiteSpace(trimmedLine) || trimmedLine.StartsWith("#"))
                continue;
            
            if (trimmedLine.StartsWith("DB_CONNECTION_STRING="))
            {
                var value = trimmedLine.Substring("DB_CONNECTION_STRING=".Length).Trim('"', '\'', ' ');
                if (!string.IsNullOrWhiteSpace(value))
                {
                    return value;
                }
            }
        }
    }

    // 4. Return default (for local development)
    return "Server=localhost;Database=SocialMeadia;Integrated Security=true;TrustServerCertificate=True;";
}

// Helper method to mask sensitive information in connection string
string MaskConnectionString(string connectionString)
{
    var masked = connectionString;
    var passwordPattern = @"Password=([^;]+)";
    masked = System.Text.RegularExpressions.Regex.Replace(masked, passwordPattern, "Password=****");
    return masked.Length > 100 ? masked.Substring(0, 97) + "..." : masked;
}
