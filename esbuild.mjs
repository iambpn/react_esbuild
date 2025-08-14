import * as dotenv from "dotenv";
import * as esbuild from "esbuild";

// Load environment variables from .env file
dotenv.config();

console.log("Building for ENV:", process.env.NODE_ENV || "production");

/**
 * @returns {esbuild.SameShape<esbuild.BuildOptions, esbuild.BuildOptions>} esbuild configuration object
 */
const makeEsbuildBaseConfiguration = () => {
  return {
    entryPoints: ["src/index.tsx"],
    bundle: true,
    minify: true,
    sourcemap: true,
    target: ["esnext"],
    define: {
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV || "production"),
    },
    plugins: [],
    outfile: "dist/out.js",
    external: ["node_modules/*"],
  };
};

if (process.env.NODE_ENV === "development") {
  const config = makeEsbuildBaseConfiguration();

  config.banner = {
    js: `/*Development build*/\nnew EventSource('/esbuild').addEventListener('change', () => location.reload());`,
  };

  const ctx = await esbuild.context(config);
  // start in watch mode
  await ctx.watch({
    delay: 500,
  });
  console.log("Watching for changes...");

  let { hosts, port } = await ctx.serve({
    servedir: ".",
    port: +process.env.PORT || 8000,
  });

  console.log(`Serving at http://${hosts[0]}:${port}`);
} else {
  const config = makeEsbuildBaseConfiguration();
  await esbuild.build(config);
  console.log("Build completed successfully.");
}
