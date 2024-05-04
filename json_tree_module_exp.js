module.exports = jsontree

const path = require("path")

function jsontree( nested_obj, ff, html, obj = { str: new String }, level=0 ){

	if( !html.value ){
		console.log( "html" )
		html.value=!html.value
	}

	//

	let { formatBytes,numberWithSpaces } = ff

	//

	for ( let key of Object.keys( nested_obj ) ) {

		//

		let { props } = nested_obj[key]

		//

		if ( props.type == "file" ){

			let text = `${ key } : ${ props.size } | ${ formatBytes(props.size) } | <span style="font-size:14px;font-family:monospace;">time: ${props.time} | dmc: ${props.dmc}</span>`

			obj.str += `<li id="child" title="${ props.pathx }">

				<span class="label_2">${ text }</span>

			</li>`

		}else if( props.type == "folder" ){

			let title = props.pathx

			if( props.size === 0 ){

				obj.str += `<li title="${ title }" style=""><button class="tree" onclick="foo(this)">${ key }</button>
					<ul>
						<li>➥&nbsp&nbsp<i>dossier vide</i></li>
					</ul>
				</li>`

			}else{

				obj.str += `<li>

						<button class="tree" onclick="foo(this)"
						data-level="${ props.level }"
						title="${ title }"
						>${ path.basename(props.pathx) }</button>

						<span class="label">${ numberWithSpaces(props.size) }</span>

						<span class="label">${ formatBytes(props.size) }</span>

						<span class="label" style="font-size:14px;font-family:monospace;">time: ${props.time}</span>

						<span class="label" style="font-size:14px;font-family:monospace;">dmc: ${props.dmc}</span>

				<ul>`

				jsontree( nested_obj[key].children, ff, html , obj, level + 1 )

				obj.str += `</ul></li>`

			}

		}

	}

	return obj.str

}
