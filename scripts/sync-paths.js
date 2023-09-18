import fs from 'fs';
import fsp from 'fs/promises';
import path from 'path';
import prettier from 'prettier';
import glob from 'tiny-glob';

function readJSON(filepath) {
  return JSON.parse(fs.readFileSync(path.resolve(process.cwd(), filepath), 'utf-8'));
}

async function getPackages() {
  return glob(`./packages/*/package.json`).then((files) =>
    files
      .map((file) => {
        const pkg = readJSON(file);
        return pkg.main ? [pkg.name, path.dirname(file)] : null;
      })
      .filter(Boolean)
      .sort(([a], [b]) => a.localeCompare(b)),
  );
}

async function writeJson(filepath, json) {
  const data = await prettier.format(JSON.stringify(json, null, 2), {
    parser: 'json',
  });

  await fsp.writeFile(filepath, data, { encoding: 'utf-8' });
}

async function writePathsToTsConfig(pkgs) {
  const tsConfig = readJSON('./tsconfig.json');

  const others = Object.entries(tsConfig.compilerOptions.paths).filter(([k]) => k[0] === '~');

  const locals = pkgs.map(([k, v]) => [k, [`${v}/src`]]);
  tsConfig.compilerOptions.paths = Object.fromEntries([...others, ...locals]);
  await writeJson('./tsconfig.json', tsConfig);
}

async function writeAliasToExamplePackageJson(pkgs) {
  const pkgJson = readJSON('./example/package.json');

  const others = Object.entries(pkgJson.alias).filter(([, v]) => !v.startsWith('../packages/'));

  const locals = pkgs.map(([k, v]) => [k, `../${v}`]);
  pkgJson.alias = Object.fromEntries([...others, ...locals]);
  await writeJson('./example/package.json', pkgJson);
}

// run
const pkgs = await getPackages();
await writePathsToTsConfig(pkgs);
await writeAliasToExamplePackageJson(pkgs);
