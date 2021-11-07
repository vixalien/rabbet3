const fetch = require("isomorphic-fetch");
const { toPOJO } = require("../convert");
// const CONSTANTS = require("../constants");

CONSTANTS = {
	ROOT_URL: "https://firestore.googleapis.com/v1/",
	PROJECT: "rabbetv4",
	DATABASE: "(default)"
}

CONSTANTS.ROOT_NAME = `projects/${CONSTANTS.PROJECT}/databases/${CONSTANTS.DATABASE}/documents`;
CONSTANTS.ROOT_PATH = `${CONSTANTS.ROOT_URL}${CONSTANTS.ROOT_NAME}`;

let find = (collection, id) => {
	return fetch(`${CONSTANTS.ROOT_PATH}/${collection}/${id}`);

	// test
	// get("pages", "2bbk5V6xMZsinNwhhTLN");
}

let query = (collection, ...queries) => {
	let collections = [collection].flat();
	queries = [queries].flat();
	return fetch(`${CONSTANTS.ROOT_PATH}:runQuery`, {
		method: "POST",
		body: JSON.stringify({
			structuredQuery: {
				"where": {
					"compositeFilter": {
						"op": "and",
						"filters": [
							queries.map(query => {
								if (query[1] == "==") query[1] = "EQUAL";
								return {
									"fieldFilter": {
										"field": { "fieldPath": query[0] },
										"op": query[1],
										"value": { "stringValue": query[2] }
									}
								}
							})
						]
					}
				},
				"from": collections.map(collection => {
					return {
						collectionId: collection,
						allDescendants: false
					}
				})
			}
		})
	})
		.then(data => {
			if (data.ok) return data;
			else throw data;
		})
		.then(data => data.json())
		.then(data => {
			return data.map(doc => {
				return {
					...doc.document,
					_id: doc.document.name.replace(new RegExp('^' + CONSTANTS.ROOT_NAME.replace('(', '\\(').replace(')', '\\)') + '/' + collection + '/'), ''),
					fields: toPOJO(doc.document.fields)
				}
			})
		})

	// test
	// query("hello", ["username", "EQUAL", hello]);
}

module.exports = { query, find };