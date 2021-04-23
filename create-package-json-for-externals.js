// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
const fs = require('fs');
const packageJson = require(process.cwd() + '/package.json');
const getWebpackConfig = require(process.cwd() + '/webpack.config');

const packageDependencies = packageJson.dependencies;

const webpackConfig = getWebpackConfig();
const webpackExternals = webpackConfig.externals ? webpackConfig.externals : [];

const imagePackageDependencies = {};
webpackExternals.forEach((packageName) => {
    if (packageDependencies.hasOwnProperty(packageName)) {
        imagePackageDependencies[packageName] = packageDependencies[packageName];
    } else {
        throw new Error(`Package '${packageName}' is not declared in package.json dependencies{} section.`);
    }
});

const newPackageJson = {
    ...packageJson,
    scripts: undefined,
    dependencies: imagePackageDependencies,
    devDependencies: undefined,
};

console.log(JSON.stringify(newPackageJson, undefined, 4));

fs.rmdirSync('./node_modules', {recursive: true});
fs.rmdirSync('./package.json', {recursive: true});
fs.writeFileSync('./package.json', JSON.stringify(newPackageJson, undefined, 4));
