
from json import dumps
from datetime import timedelta

from flask import Flask, request, jsonify, render_template, abort
from flask import make_response, request, current_app
from functools import update_wrapper

app = Flask(__name__, template_folder=".")

def crossdomain(origin=None, methods=None, headers=None,
                max_age=21600, attach_to_all=True,
                automatic_options=True):
    if methods is not None:
        methods = ', '.join(sorted(x.upper() for x in methods))
    if headers is not None and not isinstance(headers, basestring):
        headers = ', '.join(x.upper() for x in headers)
    if not isinstance(origin, basestring):
        origin = ', '.join(origin)
    if isinstance(max_age, timedelta):
        max_age = max_age.total_seconds()

    def get_methods():
        if methods is not None:
            return methods

        options_resp = current_app.make_default_options_response()
        return options_resp.headers['allow']

    def decorator(f):
        def wrapped_function(*args, **kwargs):
            if automatic_options and request.method == 'OPTIONS':
                resp = current_app.make_default_options_response()
            else:
                resp = make_response(f(*args, **kwargs))
            if not attach_to_all and request.method != 'OPTIONS':
                return resp

            h = resp.headers

            h['Access-Control-Allow-Origin'] = origin
            h['Access-Control-Allow-Methods'] = get_methods()
            h['Access-Control-Max-Age'] = str(max_age)
            if headers is not None:
                h['Access-Control-Allow-Headers'] = headers
            return resp

        f.provide_automatic_options = False
        return update_wrapper(wrapped_function, f)
    return decorator

books = {
        'books' : [
            {'title': 'Amazon Web Services in Action', 
              'description': 'Amazon Web Services in Action introduces you to computing, storing, and networking in the AWS cloud. The book will teach you about the most important services on AWS.',
              'image': 'amazon_web_services_in_action.jpg',
              'category': "Web Application", 
              'price': 100,
              'id':1},
            {'title': 'The Go Programming Language', 
              'description': "The Go Programming Language is the authoritative resource for any programmer who wants to learn Go. It shows how to write clear and idiomatic Go to solve real-world problems.",
              'image': 'the_go_programming_language.jpg',
              'category': "Language", 
              'price': 140,
              'id':2},
            {'title': 'Learning JavaScript, 3rd Edition', 
              'description': 'This is an exciting time to learn JavaScript. Now that the latest JavaScript specification - ECMAScript 6.0 (ES6) - has been finalized, learning how to develop high-quality applications with this language is easier and more satisfying than ever.',
              'image': 'learning_javascript_3rd_edition.jpg',
              'category': "Web Application", 
              'price': 100,
              'id':3},
            {'title': 'Getting Started with SQL', 
              'description': "Businesses are gathering data today at exponential rates and yet few people know how to access it meaningfully. If you're a business or IT professional, this short hands-on guide teaches you how to pull and transform data with SQL.",
              'image': 'getting_started_with_sql.jpg',
              'category': "Web Application", 
              'price': 100,
              'id':4},
            {'title': 'Excel 2016 Bible', 
              'description': "Excel 2016 Bible  Excel 2016 Bible Whether you are just starting out or an Excel novice, the Excel 2016 Bible is your comprehensive, go-to guide for all your Excel 2016 needs.",
              'image': 'excel_2016_bible.jpg',
              'category': "Office work", 
              'price': 100,
              'id':5},
            {'title': 'Learning Swift 2 Programming, 2nd Edition', 
              'description': "Learning Swift 2 Programming is a fast-paced, hands-on introduction to writing production-quality iOS and OS X apps with Apple's programming language.",
              'image': 'learning_swift_2_programming_2nd_edition.jpg',
              'category': "Language", 
              'price': 100,
              'id':6}
        ]
    }

@app.route('/bookstore/api/v1.0/books', methods=['GET'])
@crossdomain(origin='*')
def get_books():
    return jsonify(books)


@app.route('/bookstore/api/v1.0/books/<int:book_id>', methods=['GET'])
@crossdomain(origin='*')
def get_book(book_id):
    book = [book for book in books['books'] if book['id'] == book_id]
    if len(book) == 0:
        abort(404)
    return jsonify({'book': book[0]})

if __name__ == "__main__":
    app.debug = True
    app.run()
