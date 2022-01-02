import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import { calculate } from './calculate.js'

const app = express()
app.use(cors())
app.use(bodyParser.json())

app.post('/', async (req, res) => {

	const { characterID, weaponID } = req.body
	if (!characterID) {
		res.status(500).send('Invalid character ID')
		return
	}
	if (!weaponID) {
		res.status(500).send('Invalid weapon ID')
		return
	}
	let result
	try {
		result = await calculate(characterID, weaponID)
		res.send(result)
	} catch (err) {
		if (err.code === 'INVALID_ARGUMENT' && err.argument === 'user')
			res.status(500).send('Invalid Address')
		else res.status(500).send('Something went wrong! ' + err.message)
	}
})

app.listen(process.env.PORT || 8000, () =>
	console.log('listening on port', process.env.PORT || '8000')
)
