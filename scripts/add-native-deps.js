const fs = require('fs-extra');

const ROOT_PACKAGE_JSON_PATH = '../../../package.json';
const UI_PACKAGE_JSON_PATH = './package.json';

function insertNativeDependencies() {
    try {
        const rootPackageJson = fs.readJsonSync(ROOT_PACKAGE_JSON_PATH);
        const uiPackageJson = fs.readJsonSync(UI_PACKAGE_JSON_PATH);

        const uiNativeDependencies = uiPackageJson.nativeDependencies;
        const uiDependencies = uiPackageJson.dependencies;
        const nativeDeps = uiNativeDependencies.reduce(
            (o, dep) => ({ ...o, [dep]: uiDependencies[dep] }),
            {},
        );

        const newPackageJson = {
            ...rootPackageJson,
            dependencies: {
                ...rootPackageJson.dependencies,
                ...nativeDeps,
            },
        };

        fs.writeJsonSync(ROOT_PACKAGE_JSON_PATH, newPackageJson, { spaces: 2 });
        // eslint-disable-next-line no-console
        console.log(
            '[@api.video/react-native-player] - native dependencies added to root package.json',
        );
    } catch (e) {
        // eslint-disable-next-line no-console
        console.log(
            `[@api.video/react-native-player] - error adding dependencies to root package.json\n${e.message}`,
        );
        return;
    }
}

// eslint-disable-next-line no-console
console.log('[@api.video/react-native-player] - adding native dependencies to root package.json');

insertNativeDependencies();