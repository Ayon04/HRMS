using FluentValidation;
using FluentValidation.AspNetCore;
using HanaHRM.DataAccess.Models;
using HanaHRM.DTO;
using HanaHRM.Validation;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<HRMContext>(options =>
options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "HANA HRM System APIs", Version = "v1" });
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowLocalhost4200",
        builder => builder
            .WithOrigins("http://localhost:4200")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials());
});


var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
    c.RoutePrefix = "";
});

app.UseStaticFiles();
app.UseHttpsRedirection();

// CORS must come before Authorization and Routing
app.UseCors("AllowLocalhost4200");

app.UseAuthorization();

app.MapControllers();

app.Run();



//var app = builder.Build();

//app.UseSwagger();
//app.UseSwaggerUI(c =>
//{
//    c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
//    c.RoutePrefix = "";
//});
//app.UseStaticFiles();
//app.UseHttpsRedirection();
//app.UseCors("AllowLocalhost4200");
//app.UseAuthorization();

//app.MapControllers();

//app.Run();
