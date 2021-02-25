import { ExtensionContext, commands, window, workspace } from "vscode";

export function activate(context: ExtensionContext) {
  let disposable = commands.registerCommand(
    "new-ts-component-folder.newTSComponentFolder",
    (e) => {
      let selectedFolderPath = e.fsPath;
      const rootPath = workspace.workspaceFolders?.[0].uri;
      window
        .showInputBox({
          placeHolder: "MyComponent",
          validateInput: (input) => {
            if (!input) {
              return "Please enter a component name";
            }
          },
        })
        .then((componentName) => {
          if (rootPath) {
            const folderPath = `${selectedFolderPath}/${componentName}`;
            const folder = rootPath.with({
              path: folderPath,
            });
            const indexFile = rootPath.with({
              path: `${folderPath}/index.ts`,
            });
            const componentFile = rootPath.with({
              path: `${folderPath}/${componentName}.ts`,
            });

            workspace.fs.createDirectory(folder).then(() => {
              workspace.fs.writeFile(
                indexFile,
                Buffer.from(
                  `import ${componentName} from './${componentName}'

export default ${componentName}`
                )
              );
              workspace.fs.writeFile(
                componentFile,
                Buffer.from(`import React, { FC } from 'react';

type Props = {};

const ${componentName}: FC<Props> = () => {
return <></>;
};

export default ${componentName}`)
              );
            });
          }
        });
    }
  );

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
