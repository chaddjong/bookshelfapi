const {nanoid} = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
	const {
		name,
		year,
		author,
		summary,
		publisher,
		pageCount,
		readPage,
		reading,
	} = request.payload;

	const id = nanoid(16);
	const finished = pageCount === readPage;
	const insertedAt = new Date().toISOString();
	const updatedAt = insertedAt;

	const newBook = {
		name,
		year,
		author,
		summary,
		publisher,
		pageCount,
		readPage,
		finished,
		reading,
		id,
		insertedAt,
		updatedAt,
	};

	books.push(newBook);

	if (typeof name === 'undefined') {
		const response = h.response({
			status: 'fail',
			message: 'Gagal menambahkan buku. Mohon isi nama buku',
		});

		response.code(400);
		return response;
	}

	if (readPage > pageCount) {
		const response = h.response({
			status: 'fail',
			message:
        'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
		});

		response.code(400);
		return response;
	}

	const isSuccess = books.filter(book => book.id === id).length > 0;

	if (isSuccess) {
		const response = h.response({
			status: 'success',
			message: 'Buku berhasil ditambahkan',
			data: {
				bookId: id,
			},
		});
		response.code(201);
		return response;
	}

	const response = h.response({
		status: 'fail',
		message: 'Catatan gagal ditambahkan',
	});
	response.code(500);
	return response;
};

const getAllBooksHandler = (request, h) => {
	const {name, reading, finished} = request.query;

	if (books.length === 0) {
		const response = h.response({
			status: 'success',
			data: {
				books: [],
			},
		});

		response.code(200);
		return response;
	}

	let filterBook = books;

	if (typeof name !== 'undefined') {
		filterBook = books.filter(book =>
			book.name.toLowerCase().includes(name.toLowerCase()),
		);
	}

	if (typeof reading !== 'undefined') {
		filterBook = books.filter(
			book => Number(book.reading) === Number(reading),
		);
	}

	if (typeof finished !== 'undefined') {
		filterBook = books.filter(
			book => Number(book.finished) === Number(finished),
		);
	}

	const listBook = filterBook.map(book => ({
		id: book.id,
		name: book.name,
		publisher: book.publisher,
	}));

	const response = h.response({
		status: 'success',
		data: {
			books: listBook,
		},
	});

	response.code(200);
	return response;
};

const getBookByIdHandler = (request, h) => {
	const {bookId} = request.params;

	const book = books.filter(n => n.id === bookId)[0];

	if (typeof book !== 'undefined') {
		const response = h.response({
			status: 'success',
			data: {
				book,
			},
		});

		response.code(200);
		return response;
	}

	const response = h.response({
		status: 'fail',
		message: 'Buku tidak ditemukan',
	});

	response.code(404);
	return response;
};

module.exports = {addBookHandler, getAllBooksHandler, getBookByIdHandler};
