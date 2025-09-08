using Backend.Models;
using Microsoft.EntityFrameworkCore;

var  MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

var builder = WebApplication.CreateBuilder(args);

//CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
                      policy  =>
                      {
                          policy.WithOrigins("http://localhost:5173") // our client application
                                .AllowAnyHeader()
                                .AllowAnyMethod();
                      });
});

//Services
builder.Services.AddControllers();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")?? throw new ArgumentNullException("Connection string 'DefaultConnection' not found."))
);
var app = builder.Build();

app.UseCors(MyAllowSpecificOrigins);

//Middleware
app.UseRouting();
app.UseAuthorization();
app.MapControllers();
app.Run();
