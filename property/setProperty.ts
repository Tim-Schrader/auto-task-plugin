import { App, TFile, ValueComponent, stringifyYaml } from 'obsidian';
import { getProperties } from './getProperties';

const YAML = require('js-yaml');

export async function setProperty(app: App, item: TFile, property: string, propertyValue: any, propertyKey: any | any[] | undefined = undefined) {

    //get all properties
    var properties = await getProperties(app, item)

    //if no properties exist a new dictionary is made
    if (!properties) {
        properties = {}
    }

    //check if propertyKey is provided
    if (propertyKey) {

        //prepare sublist for iteration if propertyKey is an Array
        var propertySubList = properties[property]

        //check if the provided propertyKey is an Array of Keys which has to be at least 2 elements long
        if (Array.isArray(propertyKey) && propertyKey.length >= 2) {

            //remove the last Key to use it to edit the Object later
            var lastKey = propertyKey.pop()

            //iterate over the provided Key Array to get the last Object before the Target
            propertyKey.forEach(key => {
                propertySubList = propertySubList[key]
            });

        } else if (Array.isArray(propertyKey)) {
            //check if the proveded propertyKey is an Array which then has to have only 1 element which is used as lastKey
            lastKey = propertyKey[0]

        } else {
            //if the provided propertyKey is not an Array it is used as lastKey
            lastKey = propertyKey
        }

        //the propertyValue is set for the target in the property
        propertySubList[lastKey] = propertyValue

    } else {
        //the propertyValue is set for the property
        properties[property] = propertyValue
    }

    //the propertyYaml is made into a string
    var propertyText = stringifyYaml(properties)

    //get the text of the item whose property is set
    var text = await app.vault.read(item)

    //if properties exist in the target item, the text without the current properties is provided
    var firstIndex = text.indexOf('---')
    if (firstIndex !== -1) {
        var secondIndex = text.indexOf('---', firstIndex + 3);
        if (secondIndex !== -1) {

            //add new properties to the text without the old properties
            text = '---\n' + propertyText + text.substring(secondIndex)

            //the text is written to the item and the function is finished
            app.vault.modify(item, text)
            return
        }
    }

    //if no properties exist already new ones are made and the text is added
    text = '---\n' + propertyText + '---\n' + text

    //the text is written to the item
    app.vault.modify(item, text)
}
