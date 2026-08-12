import { execFileSync } from 'node:child_process';
import path from 'node:path';

const repositoryRoot = execFileSync('git', ['rev-parse', '--show-toplevel'], {
  encoding: 'utf8',
}).trim();
const webRoot = path.join(repositoryRoot, 'apps', 'web');
const javaFormatter = path.join(
  repositoryRoot,
  'apps',
  'api',
  'format-staged-java.sh'
);

const quote = (file) => `'${file.replaceAll("'", "'\\''")}'`;
const relativePath = (file) => path.relative(repositoryRoot, file);
const isWebFile = (file) => relativePath(file).startsWith('apps/web/');
const isJavaFile = (file) =>
  relativePath(file).startsWith('apps/api/') && file.endsWith('.java');
const isEslintFile = (file) => /\.(?:[cm]?[jt]sx?)$/.test(file);

export default {
  '**/*.{js,mjs,cjs,ts,tsx,css,json,md}': (files) => {
    const webFiles = files.filter(isWebFile);
    if (webFiles.length === 0) {
      return [];
    }

    const prettierFiles = webFiles.map(quote).join(' ');
    const eslintFiles = webFiles.filter(isEslintFile).map(quote).join(' ');
    const commands = [
      `pnpm --dir ${quote(webRoot)} exec prettier --write ${prettierFiles}`,
    ];

    if (eslintFiles.length > 0) {
      commands.push(
        `pnpm --dir ${quote(webRoot)} exec eslint --fix ${eslintFiles}`
      );
    }

    commands.push(`pnpm --dir ${quote(webRoot)} exec tsc --noEmit`);

    return commands;
  },
  '**/*.java': (files) => {
    if (!files.some(isJavaFile)) {
      return [];
    }

    return quote(javaFormatter);
  },
};
