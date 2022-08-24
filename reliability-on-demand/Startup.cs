// Adapted from: https://microsoft.visualstudio.com/OS.Fun/_git/reliability.cloud?path=%2Freliability.cloud.ui%2FStartup.cs

using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using reliability_on_demand.DataLayer;
using reliability_on_demand.Extensions;
using reliability_on_demand.Helpers;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.Identity.Web;

namespace reliability_on_demand
{
    /*
    @anjali to address these comments in Task 38094699
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        private static Task OnTokenValidated(Microsoft.AspNetCore.Authentication.JwtBearer.TokenValidatedContext context)
        {
            var httpContext = context.HttpContext;
            if (httpContext != null
                && httpContext.User.GetAuthenticatedUserId().UserIdClaim == null
                && context.Principal?.GetAuthenticatedUserId().UserIdClaim != null)
            {
                httpContext.User = context.Principal;
            }

            return Task.CompletedTask;
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {

            services.AddControllers();

            services.AddOptions();
            services.AddSingleton(Configuration);
            services.Configure<ValueSettings>(Configuration);
            services.Configure<KustoCredentials>(Configuration);

            //add AD auth
            services.AddAuthentication(sharedOptions =>
            {
                sharedOptions.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                sharedOptions.DefaultChallengeScheme = OpenIdConnectDefaults.AuthenticationScheme;
            })
            .AddAzureAd(options => Configuration.Bind("AzureAd", options))
            .AddJwtBearer()
            .AddCookie();


            services.Configure<OpenIdConnectOptions>(
                OpenIdConnectDefaults.AuthenticationScheme,
                options => this.Configuration.Bind("TokenValidation", options.TokenValidationParameters));


            services.Configure<JwtBearerOptions>(
                JwtBearerDefaults.AuthenticationScheme,
                options =>
                {
                    this.Configuration.Bind("TokenValidation", options.TokenValidationParameters);
                    options.Events = new JwtBearerEvents { OnTokenValidated = OnTokenValidated };
                });

            var enableAuthentication = true;
            services
                .AddControllers(
                    options =>
                    {
                        if (enableAuthentication)
                        {
                            // Require authentication by default
                            var policyBuilder = new AuthorizationPolicyBuilder(
                                JwtBearerDefaults.AuthenticationScheme,
                                CookieAuthenticationDefaults.AuthenticationScheme,
                                OpenIdConnectDefaults.AuthenticationScheme);
                            var policy = policyBuilder.RequireAuthenticatedUser().Build();
                            options.Filters.Add(new AuthorizeFilter(policy));
                        }
                    }
                    );

            // KustoClusterEndpoint has different path as it is defined in appconfig.json file
            services.PostConfigure<KustoCredentials>(options =>
            {
                if (options.KustoClusterEndpoint == null)
                {
                    options.KustoClusterEndpoint = Configuration.GetValue<string>("Kusto:KustoClusterEndpoint");
                }
            });

            // add database context
            services.AddDbContext<RIODSQLDbContext>();
            services.AddDbContext<RIODCosmosDbContext>();

            // add backend DB services
            services.AddScoped<IKustoService, KustoService>();
            services.AddScoped<ISQLService, SQLService>();
            services.AddScoped<ICosmosService, CosmosService>();
            services.AddScoped<IMicrosoftGraphAdapter,MicrosoftGraphAdapter>();

            // In production, the React files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/build";
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, ILogger<Startup> logger)
        {
            if (env.IsDevelopment())
            {
                logger.LogInformation("In Development.");
                app.UseDeveloperExceptionPage();
            }
            else
            {
                logger.LogInformation("Not Development.");
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseSpaStaticFiles();
            app.UseAuthentication();
            app.UseRouting();

            // following snippet taken from:https://docs.microsoft.com/en-us/aspnet/core/mvc/controllers/routing?view=aspnetcore-5.0#attribute-routing-for-rest-apis
            app.UseEndpoints(endpoints =>
            {
                if (env.IsDevelopment())
                    endpoints.MapControllers();
                else
                    endpoints.MapControllers();
            });

            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    // Start a separate front end by calling "npm run start" on the ClientApp folder
                    // more info at: https://docs.microsoft.com/en-us/aspnet/core/client-side/spa/react?view=aspnetcore-5.0&tabs=netcore-cli#run-the-cra-server-independently
                    spa.UseProxyToSpaDevelopmentServer("http://localhost:3000");
                    //spa.UseReactDevelopmentServer(npmScript: "start");
                }
            });
        }
    }
    */

    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {

            services.AddControllers();

            services.AddOptions();
            services.AddSingleton(Configuration);
            services.Configure<ValueSettings>(Configuration);
            services.Configure<KustoCredentials>(Configuration);

            // KustoClusterEndpoint has different path as it is defined in appconfig.json file
            services.PostConfigure<KustoCredentials>(options =>
            {
                if (options.KustoClusterEndpoint == null)
                {
                    options.KustoClusterEndpoint = Configuration.GetValue<string>("Kusto:KustoClusterEndpoint");
                }
            });

            //add AD auth
            services.AddAuthentication(sharedOptions =>
            {
                sharedOptions.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                sharedOptions.DefaultChallengeScheme = OpenIdConnectDefaults.AuthenticationScheme;
            })
            .AddAzureAd(options => Configuration.Bind("AzureAd", options))
            .AddCookie();

            // add database context
            services.AddDbContext<RIODSQLDbContext>();
            services.AddDbContext<RIODCosmosDbContext>();

            // add backend DB services
            services.AddScoped<IKustoService, KustoService>();
            services.AddScoped<ISQLService, SQLService>();
            services.AddScoped<ICosmosService, CosmosService>();
            services.AddScoped<IMicrosoftGraphAdapter, MicrosoftGraphAdapter>();

            // In production, the React files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/build";
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, ILogger<Startup> logger)
        {
            if (env.IsDevelopment())
            {
                logger.LogInformation("In Development.");
                app.UseDeveloperExceptionPage();
            }
            else
            {
                logger.LogInformation("Not Development.");
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseSpaStaticFiles();

            app.UseRouting();

            // following snippet taken from:https://docs.microsoft.com/en-us/aspnet/core/mvc/controllers/routing?view=aspnetcore-5.0#attribute-routing-for-rest-apis
            app.UseEndpoints(endpoints =>
            {
                if (env.IsDevelopment())
                    endpoints.MapControllers().WithMetadata(new AllowAnonymousAttribute());
                else
                    endpoints.MapControllers();
            });

            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp";
                
                if (env.IsDevelopment())
                {
                    // Start a separate front end by calling "npm run start" on the ClientApp folder
                    // more info at: https://docs.microsoft.com/en-us/aspnet/core/client-side/spa/react?view=aspnetcore-5.0&tabs=netcore-cli#run-the-cra-server-independently
#if DEBUG
                    spa.UseReactDevelopmentServer(npmScript: "start");
#endif

#if RELEASE
                    spa.UseProxyToSpaDevelopmentServer("http://localhost:3000");                    
#endif
                }
            });
        }
    }
}
