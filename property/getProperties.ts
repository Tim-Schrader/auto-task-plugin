import { App, TFile } from 'obsidian';

const yaml = require('js-yaml');

export async function getProperties(app: App, item: TFile, property: string | string[] | null = null) {

    //get the text from the item
    var text = await app.vault.read(item)

    //get the substring only containing the string of the properties
    var firstIndex = text.indexOf('---')
    if (firstIndex !== -1) {
        var secondIndex = text.indexOf('---', firstIndex + 3);
        if (secondIndex !== -1) {

            //turn properties string to object
            var properties = yaml.load(text.substring(firstIndex + 4, secondIndex))

            //if provided property is a string return target property
            if (typeof property == 'string') {
                return properties[property]

            } else if (Array.isArray(property)) {

                //if provided property is an array return all properties in an array
                var returnProperties: string[] = []
                property.forEach(element => {
                    returnProperties.push(element)
                });
                return returnProperties

            } else {
                
                // if no properties provided return all properties
                return properties
            }
        }
    }
}
