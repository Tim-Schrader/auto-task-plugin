import { App, TFile, stringifyYaml } from 'obsidian'
import { getProperties } from './getProperties'
import { setProperty } from './setProperty'

export async function addToProperty(app: App, item: TFile, property: string, propertyValue: any, propertyKey: any | any[] | undefined = undefined) {

    //get propertyList of the property the value has to be added
    var propertyList = await getProperties(app, item, property)

    //check if propertyKey is provided
    if (propertyKey) {

        //prepare sublist for iteration if propertyKey is an Array
        var propertySubList = propertyList

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
            
            //if the proveded propertyKey is not an Array it is used as lastKey
            lastKey = propertyKey
        }

        //if the target doesn't exist yet it is set to the propertyValue
        if (propertySubList[lastKey] == null) {
            propertySubList[lastKey] = propertyValue
        } else {

            //if the target exists but is not an array it becomes one
            if (!Array.isArray(propertySubList[lastKey])) {
                propertySubList[lastKey] = [propertySubList[lastKey]]
            }

            //the propertyValue is added to the target
            propertySubList[lastKey].push(propertyValue)
        }

        //no propertyKey is provided
    } else {

        //if the target doesn't exist yet it is set to the propertyValue
        if (propertyList == null) {
            propertyList = propertyValue
        } else {

            //if the target exists but is not an array it becomes one
            if (!Array.isArray(propertyList)) {
                propertyList = [propertyList]
            }

            //the propertyValue is added to the target
            propertyList.push(propertyValue)
        }
    }

    //the property is set to the new property with propertyValue added
    setProperty(app, item, property, propertyList)
}
