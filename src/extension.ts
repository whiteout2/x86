'use strict';

import * as vscode from 'vscode';

import { DepNodeProvider } from './nodeDependencies'
import { JsonOutlineProvider } from './jsonOutline'
import { FtpExplorer } from './ftpExplorer.textDocumentContentProvider'

export function activate(context: vscode.ExtensionContext) {
	const rootPath = vscode.workspace.rootPath;

	const foo = new DepNodeProvider(rootPath, 0);
	foo.parseHTMLFile();

	//const nodeDependenciesProvider = new DepNodeProvider(rootPath);
	const nodeDependenciesProvider1 = new DepNodeProvider(rootPath, 1);
	const nodeDependenciesProvider2 = new DepNodeProvider(rootPath, 2);
	const nodeDependenciesProvider3 = new DepNodeProvider(rootPath, 3);
	const nodeDependenciesProvider4 = new DepNodeProvider(rootPath, 4);
	const jsonOutlineProvider = new JsonOutlineProvider(context);

	//vscode.window.registerTreeDataProvider('nodeDependencies', nodeDependenciesProvider);
	vscode.window.registerTreeDataProvider('nodeDependencies1', nodeDependenciesProvider1);
	vscode.window.registerTreeDataProvider('nodeDependencies2', nodeDependenciesProvider2);
	vscode.window.registerTreeDataProvider('nodeDependencies3', nodeDependenciesProvider3);
	vscode.window.registerTreeDataProvider('nodeDependencies4', nodeDependenciesProvider4);
	
	//vscode.commands.registerCommand('nodeDependencies.refreshEntry', () => nodeDependenciesProvider.refresh());
	vscode.commands.registerCommand('nodeDependencies1.refreshEntry', () => nodeDependenciesProvider1.refresh());
	vscode.commands.registerCommand('nodeDependencies2.refreshEntry', () => nodeDependenciesProvider2.refresh());
	vscode.commands.registerCommand('nodeDependencies3.refreshEntry', () => nodeDependenciesProvider3.refresh());
	vscode.commands.registerCommand('nodeDependencies4.refreshEntry', () => nodeDependenciesProvider4.refresh());

	vscode.commands.registerCommand('nodeDependencies1.addEntry', node => vscode.window.showInformationMessage('Successfully called add entry'));
	vscode.commands.registerCommand('nodeDependencies2.addEntry', node => vscode.window.showInformationMessage('Successfully called add entry'));
	vscode.commands.registerCommand('nodeDependencies3.addEntry', node => vscode.window.showInformationMessage('Successfully called add entry'));
	vscode.commands.registerCommand('nodeDependencies4.addEntry', node => vscode.window.showInformationMessage('Successfully called add entry'));

	vscode.commands.registerCommand('nodeDependencies1.deleteEntry', node => vscode.window.showInformationMessage('Successfully called delete entry'));
	vscode.commands.registerCommand('nodeDependencies2.deleteEntry', node => vscode.window.showInformationMessage('Successfully called delete entry'));
	vscode.commands.registerCommand('nodeDependencies3.deleteEntry', node => vscode.window.showInformationMessage('Successfully called delete entry'));
	vscode.commands.registerCommand('nodeDependencies4.deleteEntry', node => vscode.window.showInformationMessage('Successfully called delete entry'));

	// This opens mnemonic documentation in a browser
	vscode.commands.registerCommand('extension.openPackageOnNpm', moduleName => vscode.commands.executeCommand('vscode.open', vscode.Uri.parse(`https://www.felixcloutier.com/x86/${moduleName}.html`)));

	vscode.window.registerTreeDataProvider('jsonOutline', jsonOutlineProvider);
	vscode.commands.registerCommand('jsonOutline.refresh', () => jsonOutlineProvider.refresh());
	vscode.commands.registerCommand('jsonOutline.refreshNode', offset => jsonOutlineProvider.refresh(offset));
	vscode.commands.registerCommand('jsonOutline.renameNode', offset => jsonOutlineProvider.rename(offset));
	vscode.commands.registerCommand('extension.openJsonSelection', range => jsonOutlineProvider.select(range));

	new FtpExplorer(context);
}
