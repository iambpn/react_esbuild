import * as esbuild from "esbuild";

console.log("Building for ENV:", process.env.NODE_ENV);

const ctx = await esbuild.context({
  entryPoints: ["src/index.jsx"],
  bundle: true,
  minify: true,
  sourcemap: true,
  target: ["chrome58", "firefox57", "safari11", "edge16"],
  define: {
    "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV || "production"),
  },
  outfile: "dist/out.js",
});

if (process.env.NODE_ENV === "development") {
  // start in watch mode
  await ctx.watch({
    delay: 500,
  });
  console.log("Watching for changes...");

  let { hosts, port } = await ctx.serve({
    servedir: ".",
  });

  console.log(`Serving at http://${hosts[0]}:${port}`);
} else {
  await ctx.rebuild();
  await ctx.dispose();
}
