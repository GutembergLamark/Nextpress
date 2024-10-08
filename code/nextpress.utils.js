const fs = require('fs')
const path = require('path')

const templateFunctions = {
    module: function () {
        let moduleName = process.argv[3]
        let moduleMainFolder = findFolder('./src', 'modules')
        let moduleFolder = `./${moduleMainFolder}/${moduleName}`
        let moduleTemplate = fs.readFileSync(
            './templates/nextpress.utils.module.tsx',
            'utf-8'
        )
        moduleTemplate = moduleTemplate.replace('// @ts-nocheck', '')
        if (!moduleName) {
            console.error(
                new Error('Você não especificou um nome para seu módulo.')
            )
            return
        }
        moduleTemplate = moduleTemplate
            .replaceAll('__MODULENAME__', moduleName)
            .trim()
        fs.mkdirSync(moduleFolder)
        fs.writeFileSync(`${moduleFolder}/${moduleName}.scss`, '')
        console.log(
            `-- "${moduleFolder}/${moduleName}.scss" criado com sucesso.`
        )
        fs.writeFileSync(`${moduleFolder}/${moduleName}.tsx`, moduleTemplate)
        console.log(
            `-- "${moduleFolder}/${moduleName}.tsx" criado com sucesso.`
        )

        // Import caring
        let importFile = fs.readFileSync(
            `${moduleMainFolder}/index.ts`,
            'utf-8'
        )
        importFile = importFile.replace(
            /\/\/<NEXTPRESS-BACK-AUTO-IMPORT>\/\//g,
            `export { ${moduleName} } from './${moduleName}/${moduleName}'\n//<NEXTPRESS-BACK-AUTO-IMPORT>//`
        )
        fs.writeFileSync(`${moduleMainFolder}/index.ts`, importFile)
        console.log('-- Importação automática realizada.')
    },
    layout: function () {
        let layoutName = process.argv[3]
        let layoutMainFolder = findFolder('./src', 'layouts')
        let layoutFolder = `./${layoutMainFolder}/${layoutName}`
        let layoutTemplate = fs.readFileSync(
            './templates/nextpress.utils.layout.tsx',
            'utf-8'
        )
        layoutTemplate = layoutTemplate.replace('// @ts-nocheck', '')
        if (!layoutName) {
            console.error(
                new Error('Você não especificou um nome para seu layout.')
            )
            return
        }
        layoutTemplate = layoutTemplate.replaceAll('__LAYOUTNAME__', layoutName)
        fs.mkdirSync(layoutFolder)
        fs.writeFileSync(`${layoutFolder}/${layoutName}.scss`, '')
        console.log(
            `-- "${layoutFolder}/${layoutName}.scss" criado com sucesso.`
        )
        fs.writeFileSync(`${layoutFolder}/${layoutName}.tsx`, layoutTemplate)
        console.log(
            `-- "${layoutFolder}/${layoutName}.tsx" criado com sucesso.`
        )

        // Import caring
        let importFile = fs.readFileSync(
            `${layoutMainFolder}/index.ts`,
            'utf-8'
        )
        importFile = importFile.replace(
            /\/\/<NEXTPRESS-BACK-AUTO-IMPORT>\/\//g,
            `export { ${layoutName} } from './${layoutName}/${layoutName}'\n//<NEXTPRESS-BACK-AUTO-IMPORT>//`
        )
        fs.writeFileSync(`${layoutMainFolder}/index.ts`, importFile)
        console.log('-- Importação automática realizada.')
    },

    component: {
        general: function () {
            createComponent('general')
        },
        form: function () {
            createComponent('forms')
        },
        field: function () {
            createComponent('formsInputs')
        },
        modal: function () {
            createComponent('modals')
        },
    },

    internal: function () {
        let moduleName = process.argv[3]
        let typeFlag = process.argv[4]
        let postType = process.argv[5]
        let moduleMainFolder = findFolder('./src', '(internal)')
        if (!moduleMainFolder) {
            console.log(new Error('Deve haver um diretório (internal) dentro do diretório (routes)'));
            return;
        }
        let moduleFolder = `./${moduleMainFolder}/${moduleName}/`

        let moduleTemplate = fs.readFileSync(
            './templates/nextpress.utils.internal.tsx',
            'utf-8'
        )
        moduleTemplate = moduleTemplate.replace('// @ts-nocheck', '')
        if (!moduleName) {
            console.error(
                new Error('Você não especificou um nome para seu módulo.')
            )
            return
        }

        moduleTemplate = moduleTemplate
            .replaceAll('__MODULENAME__', moduleName)
            .trim()

        if (typeFlag === '--post') {
            moduleTemplate = moduleTemplate.replaceAll('__POSTTYPE__', postType).trim()
        } else {
            console.log(new Error('A flag --post determina qual o post type da interna'));
            return
        }

        fs.mkdirSync(moduleFolder)
        moduleMainFolder = findFolder('./src', moduleName)
        moduleFolder = `${moduleFolder}[slug]/`
        fs.mkdirSync(moduleFolder)


        fs.writeFileSync(`${moduleFolder}/page.tsx`, moduleTemplate)
        console.log(
            `-- "${moduleFolder}/page.tsx" criado com sucesso.`
        )
    }
}

let type = process.argv[2]?.replace('--', '')
let templateType = templateFunctions[type]
if (templateType == templateFunctions.component) {
    let componentTemplate = templateFunctions[process.argv[2]?.replace('--', '')][process.argv[3]?.replace('--', '')]
    componentTemplate()
} else if (type !== 'component') templateType()
else console.error(new Error('Template inválido.'))

// General Functions
function findFolder(rootFolder = './src', folderName, type = undefined) {
    const files = fs.readdirSync(rootFolder)

    for (const file of files) {
        const filePath = path.join(rootFolder, file)
        const stat = fs.statSync(filePath)

        if (stat.isDirectory() && file === folderName) {
            return filePath
        } else if (stat.isDirectory()) {
            const foundFolder = findFolder(filePath, folderName)
            if (foundFolder) {
                return foundFolder
            } else if (type === 'component') {

                const folder = `./src/components`
                const isFolder = fs.statSync(folder).isDirectory()

                if (isFolder) {
                    const componentFolder = `${folder}/${folderName}`
                    const found = fs.existsSync(componentFolder)

                    if (!found) {
                        fs.mkdirSync(componentFolder)
                        fs.writeFileSync(`${componentFolder}/index.ts`, "//<NEXTPRESS-BACK-AUTO-IMPORT>//")
                        return findFolder(folder, folderName) ?? null
                    }
                }
            }
        }
    }

    return null
}

function createComponent(type) {
    let componentName = process.argv[4]
    let componentMainFolder = findFolder('./src', type, 'component')
    let componentFolder = `./${componentMainFolder}/${componentName}`
    let componentTemplate = fs.readFileSync(
        './templates/nextpress.utils.component.tsx',
        'utf-8'
    )
    componentTemplate = componentTemplate.replace('// @ts-nocheck', '')
    if (!componentName) {
        console.error(
            new Error('Você não especificou um nome para seu componente.')
        )
        return
    }
    componentTemplate = componentTemplate
        .replaceAll('__COMPONENTNAME__', componentName)
        .trim()
    fs.mkdirSync(componentFolder)
    fs.writeFileSync(`${componentFolder}/${componentName}.module.scss`, '')
    console.log(
        `-- "${componentFolder}/${componentName}.module.scss" criado com sucesso.`
    )
    fs.writeFileSync(`${componentFolder}/${componentName}.tsx`, componentTemplate)
    console.log(
        `-- "${componentFolder}/${componentName}.tsx" criado com sucesso.`
    )

    let importFile = fs.readFileSync(
        `${componentMainFolder}/index.ts`,
        'utf-8'
    )
    importFile = importFile.replace(
        /\/\/<NEXTPRESS-BACK-AUTO-IMPORT>\/\//g,
        `export { ${componentName} } from './${componentName}/${componentName}'\n//<NEXTPRESS-BACK-AUTO-IMPORT>//`
    )
    fs.writeFileSync(`${componentMainFolder}/index.ts`, importFile)
    console.log('-- Importação automática realizada.')

}

