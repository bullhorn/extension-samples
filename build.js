//fix build file
// Vendor
const chalk = require('chalk');
const targz = require('tar.gz');
const fs = require('fs-extra');
const async = require('async');
const zlib = require('zlib');
const UglifyJS = require('uglify-js');
const glob = require('glob');


console.log(chalk.blue('[Package] - Building Bullhorn-Starter for production'));

let time = Date.now();

console.log(chalk.blue('[Package] - Uglifying DIST folder'));

glob('dist/**/*.js', (err, files) => {
    if (err) {
        console.log(chalk.red('[Package] - No files found to Uglify!!'));
    } else {
        async.each(files, (file, callback) => {
            console.log(chalk.blue(`[Package] - minifying ${file}`));
            let result = UglifyJS.minify(file, {
                'beautify': false,
                'comments': false,
                'sourceMap': false,
                'mangle': {
                    'screw_ie8': true,
                    'keep_fnames': true
                },
                'compress': {
                    'screw_ie8': true,
                    'warnings': false
                }
            });
            fs.unlinkSync(file);
            fs.writeFileSync(file.replace('.js', '.min.js'), result.code);
            console.log(chalk.blue(`[Package] - minifying complete for ${file} in ${(Date.now() - time) / 1000}s`));
            callback();
        }, () => {
            console.log(chalk.green(`[Package] - Uglifying DIST folder COMPLETE in ${(Date.now() - time) / 1000}s`));
            console.log(chalk.blue('[Package] - Renaming ".min.js" files back to ".js"'));
            glob('dist/**/*.js', (err, files) => {
                async.each(files, (file, callback) => {
                    console.log(chalk.blue(`[Package] - renaming ${file} to ${file.replace('.min.js', '.js')}`));
                    fs.renameSync(file, file.replace('.min.js', '.js'));
                    callback();
                }, () => {
                    console.log(chalk.green('[Package] - Renaming complete'));
                    console.log(chalk.blue('[Package] - Compressing DIST folder'));
                    glob('dist/**/*.js', (err, files) => {
                        async.each(files, (file, callback) => {
                            console.log(chalk.blue(`[Package] - compressing ${file} to ${file}.qz`));
                            let stream = fs.createReadStream(file)
                                .pipe(zlib.createGzip())
                                .pipe(fs.createWriteStream(`${file}.gz`));
                            stream.on('close', () => {
                                callback();
                            })
                        }, (err) => {
                            console.log(chalk.green('[Package] - Compressing complete'));

                            // Copy files into a package folder that we can zip
                            console.log(chalk.blue('[Package] - Copying everything over to a "bullhorn-starter" folder'));
                            fs.copySync('server', 'bullhorn-starter/server');
                            fs.copySync('index.js', 'bullhorn-starter/index.js');
                            fs.copySync('dist', 'bullhorn-starter/dist');
                            fs.copySync('package.json', 'bullhorn-starter/package.json');
                            fs.copySync('ecosystem.json', 'bullhorn-starter/ecosystem.json');
                            fs.copySync(`node_modules`, `bullhorn-starter/node_modules`);


                            // Compress the package
                            console.log(chalk.blue('[Package] - Creating the \"bullhorn-starter.tar.gz\""'));
                            targz().compress('bullhorn-starter', 'bullhorn-starter.tar.gz', error => {
                                if (error) {
                                    console.error(chalk.red('Error!'), error);
                                }
                                console.log(chalk.blue(`[Package] - Packaging complete in ${(Date.now() - time) / 1000}s!`));
                            });
                        });
                    });
                });
            });
        });
    }
});
