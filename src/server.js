const routes = require('./routes');
const Hapi = require('@hapi/hapi');

const init = async () => {
	const server = Hapi.server({
		// [M] Kriteria 1 : Aplikasi menggunakan port 9000
		port: 9000,
		host: 'localhost',
	});

	server.route(routes);

	await server.start();
	console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
