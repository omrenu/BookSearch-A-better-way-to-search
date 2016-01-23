/*jslint browser: true*/
/*global $, jQuery, console*/

$(document).ready(function(){

    "use strict";

    $('#search').keyup(function(){

        var searchField = $('#search').val();
        var regex = new RegExp(searchField, "i");
        var searchcount = 0;
        $.ajax('https://capillary.0x10.info/api/books?type=json&query=list_books', {

            beforeSend: function () {
               $('#books').append(bookHub.loader);


            },
            complete: function () {
                setTimeout(function () {
                    $('#books .loader').remove();
                    //$("#books").html("");
                    //$(".totalBooks").html("");
                    $(".totalBooks").html(searchcount);
                }, 4500);
            },
            success: function (booksData) {

                $("#books").html(" ");
                $(".totalBooks").html(" ");
                for (var i = 0; i < booksData.books.length; i++) {
                    var book = booksData.books[i];
                    if ((book.name.search(regex) != -1) || (book.author.search(regex) != -1)||(book.rating.search(regex) != -1)) {

                        book = booksData.books[i];
                        bookHub.mt(i, book);
                        searchcount++;

                    }
                }
                if(searchcount == 0)
                {
                    $("#books").html("<div class=noData>"+searchField+"  "+"have No Result</div>")
                }


            }
        });

    });


    var bookHub = (function($){

        //VARIABLES

        var loader = $('<div class="loader"></div>'),
            bookContent,
            bookRowLayout,
            bookCoulmnLayout,
            bookLayout,
            bookImageLayout,
            bookContentLayout,
            requestPending = true;

        // METHODS

        var initialize,
            makeTimeout;


        makeTimeout = function(i,book){

            setTimeout(function (){

                bookRowLayout = $('<ul class="collection">');
                //bookContent.append('<h4>'+book.id+'</h4>').append('<h5>'+book.name+'</h5>').append('<h4>'+book.author+'</h4>').append('<h4>'+book.price+'</h4>').append('<h4>'+book.rating+'</h4>').append('<p>'+book.description+'</p>');
                    bookCoulmnLayout = $('<li class="collection-item avatar"></div>');

                         //bookLayout = $('<div class="card blue-grey darken-1"></div>');
                //bookImageLayout = $('<div class="card-image"><img src='+book.image+'><span class="card-title">book.name</span></div>');
                          bookContentLayout = $('<i class="material-icons">book</i><span class="title">'+book.name+'</span><p>Author:'+book.author+'<br>Price:'+book.price+'</br></p><a href="'+book.id+'" class="secondary-content"><i class="material-icons">send</i></a>');

                bookCoulmnLayout.append(bookContentLayout);
                bookRowLayout.append(bookCoulmnLayout);
                $('#books').append(bookRowLayout);
                //bookContent.hide().fadeIn();
            },i*10);

        };

        //INIT method
        initialize = function(){
            /* Sidebar Menu */
            $(".button-collapse").sideNav();


            $.ajax('https://capillary.0x10.info/api/books?type=json&query=list_books',{

                beforeSend:function(){
                    $('#books').append(loader);

                },
                complete : function(){
                    setTimeout(function() {
                        requestPending = false;
                        $('#books .loader').remove();
                    }, 4500);
                },
                success : function(booksData){
                    $(".totalBooks").html(parseInt(booksData.books.length));
                    for (var i = 0; i < booksData.books.length; i++) {
                        var book = booksData.books[i];
                        makeTimeout (i, book);
                    }
                }

            });

        };
        return {
            init:initialize,
            mt:makeTimeout
        };

    }(jQuery));
    bookHub.init();
});