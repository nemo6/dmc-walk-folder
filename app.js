const fs   = require("fs")
const path = require("path")
const _    = require(`lodash`)

const dayjs = require(`dayjs`)
require(`dayjs/locale/fr`)
dayjs.locale("fr")

const duration = require(`dayjs/plugin/duration`)
dayjs.extend(duration)

const jsontree = require("./json_tree_module_exp")

let html = { value:false }

;( () => {

	_.mixin({walk_folder,csvToJson,jsontree})

	let result = _(`test_dir`)
	.walk_folder()
	.filter( x => x.type == "folder")
	.sort( (a,b) => b.dmc - a.dmc )
	// .csvToJson()
	// .jsontree( {formatBytes,numberWithSpaces}, html ).thru( render )
	.valueOf()

	serverEx( ...ishtml(result) )

})()

function ishtml(x){
	if( html.value )
	return [ x ,"html"]
	else
	return [ JSON.stringify(x,null,2), "" ]
}

function walk_folder(dir,level=0){

	let list = fs.readdirSync(dir)

	let size = 0
	let table = []

	let m_dmc  = []
	let m_time = []

	for ( let file of list ){

		let pathx = dir + "/" + file

		let stats = fs.statSync(pathx)

		if ( stats.isFile() /*&& path.extname(file) == ".js"*/ ){

			table.push({

				filename : path.basename(pathx),
				size     : stats.size,
				dmc      : btime(stats.mtime),
				time     : btime(stats.birthtime),
				pathx    : pathx,
				type     : "file",
				level    : level+1,

			})

			size += stats.size
			m_dmc.push(stats.mtime)
			m_time.push(stats.birthtime)

		}else if ( stats.isDirectory() ){

			// walk_folder(pathx,table)

			let [a,b] = walk_folder(pathx,level+1)
			table = table.concat(a)
			size += b

		}

	}

	let dmc  = Math.max(...m_dmc)
	let time = Math.min(...m_time)

	table.push({
		pathx : dir,
		size  : size,
		type  : "folder",
		dmc   : btime(dmc),
		time  : btime(time),
		level : level
	})

	if( level == 0 )
	return table
	else
	return [table,size]

}

function csvToJson(m){

	console.log("csvToJson")

	let obj = {}

	for( let x of m ){

		// console.log( x.pathx.split("/") )

		;[...x.pathx.split("/").slice(4)].reduce( (o,v,i,arr) => {

			if( o[v] == undefined ){

				o[v] = { props:{}, children:{} }// o[v] = {} | o[v] = [{},{}]

			}

			if( x.type == "file" && i == arr.length-1 ){

				Object.assign( o[v].props, { ...x } )

			}

			if( x.type == "folder" && i == arr.length-1 ){

				Object.assign( o[v].props, { ...x } )

			}

			return o[v].children

		}, obj )

	}

	return obj

}

function btime(x){
	// return dayjs(x).format("dddd DD MMMM YYYY HH:mm:ss")
	return dayjs(x).format("DD.MM.YY HH:mm:ss")
}

function serverEx(x,n){ // toggle_selection // foo(

	const path = require("path")
	const express = require(`express`)
	const app = express()
	const PORT = 8080

	app.use( express.static( `module_exp/javascript/jsontree`  ) )

	app.get( "/", function (req, res) {

		res.writeHead(200,{"content-type":`text/${n};charset=utf8`})
		res.end(x)

	})

	app.listen(PORT)

	console.log(`Running at port ${PORT}`)

}

function numberWithSpaces(x){
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g,".")
}

function formatBytes(bytes,decimals=3) {
	if (bytes === 0) return "0 octets"
	const k = 1024
	const dm = decimals < 0 ? 0 : decimals
	const sizes = ["octets", "ko", "mo", "go", "to", "po", "eo", "zo", "yo"];
	const i = Math.floor(Math.log(bytes) / Math.log(k))
	float = parseFloat((bytes / Math.pow(k, i)).toFixed(dm))
	return Math.trunc(float) + " " + sizes[i]
}

function render(){
	return `<link rel="stylesheet" type="text/css" href="style-jsontree.css">`
	+ `<script src="script-jsontree.js"></script>`
	+ `<div style="display:flex;justify-content:space-evenly;position:fixed;z-index:1;">
	   <button onclick="button_level(this)" >level 0</button>
	   <button onclick="button_level(this)" >level 1</button>
	   <button onclick="button_level(this)" >level 2</button>
	   <button onclick="button_level(this)" >level 3</button>
	   </div><br><br>`
	+ x
}
