import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';


// TEST: Let's make it global
var deps = new Array<Dependency>();
var g_html = '';


export class DepNodeProvider implements vscode.TreeDataProvider<Dependency> {

	private _onDidChangeTreeData: vscode.EventEmitter<Dependency | undefined> = new vscode.EventEmitter<Dependency | undefined>();
	readonly onDidChangeTreeData: vscode.Event<Dependency | undefined> = this._onDidChangeTreeData.event;

	constructor(private workspaceRoot: string, private view: number) {
		// TODO: Call this only once at extension start. No need to call it here for every view.
		//this.parseHTMLFile();
	}

	refresh(): void {
		console.log("Refresh view:", this.view);
		this._onDidChangeTreeData.fire(null);
	}

	getTreeItem(element: Dependency): vscode.TreeItem {
		return element;
	}

	getChildren(element?: Dependency): Thenable<Dependency[]> {
		// if (!this.workspaceRoot) {
		// 	vscode.window.showInformationMessage('No dependency in empty workspace');
		// 	return Promise.resolve([]);
		// }

		return new Promise(resolve => {
		/* 	if (element) {
				resolve(this.getDepsInPackageJson(path.join(this.workspaceRoot, 'node_modules', element.label, 'package.json')));
			} else {
				const packageJsonPath = path.join(this.workspaceRoot, 'package.json');
				if (this.pathExists(packageJsonPath)) {
					resolve(this.getDepsInPackageJson(packageJsonPath));
				} else {
					vscode.window.showInformationMessage('Workspace has no package.json');
					resolve([]);
				}
			} */
			
			// Also make it work in an empty workspace
			resolve(this.getDepsInPackageJson('foobar'));
		});
		
	}

	/**
	 * Given the path to package.json, read all its dependencies and devDependencies.
	 */
	private getDepsInPackageJson(packageJsonPath: string): Dependency[] {

		// TODO: hier een Dependency[] (i.e. subclass van TreeItem[]) teruggeven met je eigen items
	
		// some old stuff
		/*	
		const dep1 = new Dependency('AAA', 'ASCII Adjust After Addition', vscode.TreeItemCollapsibleState.None, {
			command: 'extension.openPackageOnNpm',
			title: '',
			arguments: ['AAA']
		});
		const dep2 = new Dependency('AAD', 'ASCII Adjust AX Before Division', vscode.TreeItemCollapsibleState.None, {
			command: 'extension.openPackageOnNpm',
			title: '',
			arguments: ['AAD']
		});
		const dep3 = new Dependency('AAM', 'ASCII Adjust AX After Multiply', vscode.TreeItemCollapsibleState.None, {
			command: 'extension.openPackageOnNpm',
			title: '',
			arguments: ['AAM']
		});
		const dep4 = new Dependency('AAS', 'ASCII Adjust AL After Subtraction', vscode.TreeItemCollapsibleState.None, {
			command: 'extension.openPackageOnNpm',
			title: '',
			arguments: ['AAS']
		});
		*/


		//return new Array<Dependency>(dep1, dep2, dep3, dep4);
		//return deps;

		// Should let html parser fill different arrays for each view/table but that code is 
		// complex enough as it is. We'll just index into the total array here.
		switch (this.view) {
			case 1: return deps.slice(0, this.getIndex('XTEST')+1);
			//case 2: return deps.slice(this.getIndex('EACCEPT'), this.getIndex('EWB')+1);
			case 2: return deps.slice(this.getIndex('ENCLS'), this.getIndex('ENCLV[ESETCONTEXT]')+1);
			case 3: return deps.slice(this.getIndex('GETSEC[CAPABILITIES]'), this.getIndex('GETSEC[WAKEUP]')+1);
			case 4: return deps.slice(this.getIndex('INVEPT'), this.getIndex('VMXON')+1);
			case 5: return deps.slice(this.getIndex('PREFETCHWT1'), this.getIndex('VSCATTERPF1QPS')+1);
		}


		
		// Sample code //////////////
		/*if (this.pathExists(packageJsonPath)) {
			const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

			const toDep = (moduleName: string, version: string): Dependency => {
				if (this.pathExists(path.join(this.workspaceRoot, 'node_modules', moduleName))) {
					// Hier als module meerdere submodules heeft
					return new Dependency(moduleName, version, vscode.TreeItemCollapsibleState.Collapsed);
				} else {
					// Hier als het een eind module is
					return new Dependency(moduleName, version, vscode.TreeItemCollapsibleState.None, {
						command: 'extension.openPackageOnNpm',
						title: '',
						arguments: [moduleName]
					});
				}
			}

			const deps = packageJson.dependencies
				? Object.keys(packageJson.dependencies).map(dep => toDep(dep, packageJson.dependencies[dep]))
				: [];
			const devDeps = packageJson.devDependencies
				? Object.keys(packageJson.devDependencies).map(dep => toDep(dep, packageJson.devDependencies[dep]))
				: [];
			return deps.concat(devDeps);
		} else {
			return [];
		}*/

	}

	private pathExists(p: string): boolean {
		try {
			fs.accessSync(p);
		} catch (err) {
			return false;
		}

		return true;
	}

	public parseHTMLFile() {
		// Now lets make a list by filling an Array
		// We can then parse a file with mnemonics and create the array of list items

		//var deps = new Array<Dependency>();

		var mnemonic = 'AAA';
		var summary = 'ASCII Adjust AL After Subtraction';
		var link = './AAA.html';

		var found_td = false;
		var column = 1;
		//var table = 0;
		
		
		// Read html file
		//fs.readFileSync('https://www.felixcloutier.com/x86/index.html', 'utf-8')
		//request('http://google.com/doodle.png').pipe(fs.createWriteStream('doodle.png'))
		//var html = '';
		var request = require('request');
		//request('http://google.com/doodle.png').pipe(fs.createWriteStream('doodle.png'));
		request.get('https://www.felixcloutier.com/x86/index.html', function (error, response, body) {
			if (!error && response.statusCode == 200) {
				// HELL: can't get body in a global var. 
				// It will lose its value once we go out of scope.
				// So we will have to do all parsing in this fuction
				// YESS: This function will run asynchronously. So when we are in getDepsInPackageJson()
				// for the first time, request.get() must first fetch the file. Then the parsing starts in
				// this callback. But we then are already out of getDepsInPackageJson() and deps will
				// still not be filled. All the shit is because we are doing this in a callback.
				// Things had to go wrong:
				// getDepsInPackageJson() gets called several times
				// request.get() uses a callback
				// htmlparser.Parser() uses a callback
				// The last two must only be done once in the constructor.
				// It is nice that type/javascript has all these anonymous functions but it quickly
				// becomes very confusing.
				// TODO: Must do this only once. deps needs to be filled only once.
				var html = body;
				g_html = body;
				// Continue with your processing here.
				//var test = body;
				// CHECK: Write to Debug Console
				//console.log('error:', error); // Print the error if one occurred
				//console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
				//console.log('body:', body); // Print the HTML for the Google homepage.


				// TEST: reading html and writing to file for use in previewHtml
				// OK works!
				var myExtDir = vscode.extensions.getExtension ("whiteout2.x86").extensionPath;
				//fs.writeFileSync('/Users/RG/Documents/comp/whiteout2/tree-view-sample-x86/x86/index.html', body);
				fs.writeFileSync(myExtDir + '/x86/index.html', body);



				// TODO: Parse <a href></a> as some mnemonics are grouped together on one page
			
				// Parse html file
				// NOTE: fucks up with: (1)</td>
				var htmlparser = require("htmlparser2");
				var parser = new htmlparser.Parser({
					onopentag: function (name, attribs) {
						if (name === "td") {  // && attribs.type === "text/javascript") {
							//console.log("TD! Hooray!");
							found_td = true;
						}
						if (name === "a" && found_td) {
							console.log("link: ", attribs.href);
							link = attribs.href;
							link = link.slice(2, link.length);
						}
						//if (name === "table") {
						//	table++;;
						//}
					},
					ontext: function (text) {
						//console.log("-->", text);
						if (found_td && column == 1) {
							//console.log("-->", text);
							mnemonic = text;
							column = 2;
						} else
						if (found_td && column == 2) {
							//console.log("-->", text);
							// kludge for (1)</td> and (2)</td>
							if (text.indexOf('(1)') != -1 ||
								text.indexOf('(2)') != -1) 
							{
								mnemonic += text;
							} else {
								summary = text;
								column = 1;							

								// Add found mnemonic-summary to array
								// HELL: The array gets never filled
								// It's like all variables are deleted once we go out of request.get() scope
								// NONO: It gets filled OK. You can see it in Debug with a breakpoint on deps.push()
								// It is just that we lose all variables once we go out of scope
								var dep = new Dependency(mnemonic, summary, vscode.TreeItemCollapsibleState.None, {
									command: 'extension.openPackageOnNpm',
									title: '',
									arguments: [mnemonic, link]
								});

								deps.push(dep);
							}
						}
					},
					onclosetag: function (tagname) {
						if (tagname === "td") {
							//console.log("That's it?!");
							found_td = false;
						}
					}
				}, { decodeEntities: true });
				parser.write(html);
				parser.end();
				
				// End parse
				console.log("Parse end.");

				// Trigger a refresh of the 5 views
				vscode.commands.executeCommand('nodeDependencies1.refreshEntry');
				vscode.commands.executeCommand('nodeDependencies2.refreshEntry');
				vscode.commands.executeCommand('nodeDependencies3.refreshEntry');
				vscode.commands.executeCommand('nodeDependencies4.refreshEntry');
				vscode.commands.executeCommand('nodeDependencies5.refreshEntry');

			}
		}); // End: request.get()
	}

	private getIndex(mnemonic: string): number {
		for (var i = 0; i < deps.length; i++) {
			if (deps[i].label == mnemonic) break;
		}
		return i;
	}

}

class Dependency extends vscode.TreeItem {

	constructor(
		public readonly label: string,
		private version: string,
		public readonly collapsibleState: vscode.TreeItemCollapsibleState,
		public readonly command?: vscode.Command
	) {
		super(label, collapsibleState);

		this.tooltip = `${this.label}-${this.version}`;
		this.description = this.version;
	}

	//get tooltip(): string {
	//	return `${this.label} - ${this.version}`
	//}

	iconPath = {
		light: path.join(__filename, '..', '..', '..', 'resources', 'light', 'dependency.svg'),
		dark: path.join(__filename, '..', '..', '..', 'resources', 'dark', 'dependency.svg')
	};

	contextValue = 'dependency';

}