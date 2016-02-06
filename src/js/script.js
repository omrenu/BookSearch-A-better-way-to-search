///*jslint browser: true*/
///*global $, jQuery, console*/
//
//$(document).ready(function(){
//
//    "use strict";
//
//
//
//    $('#search').keyup(function(){
//
//        var searchField = $('#search').val();
//        var regex = new RegExp(searchField, "i");
//        var searchcount = 0;
//        $.ajax('https://capillary.0x10.info/api/books?type=json&query=list_books', {
//
//            beforeSend: function () {
//               $('#books').append(bookHub.loader);
//
//
//            },
//            complete: function () {
//                setTimeout(function () {
//                    $('#books .loader').remove();
//                    //$("#books").html("");
//                    //$(".totalBooks").html("");
//                    $(".send-button").html(searchcount);
//                }, 4500);
//            },
//            success: function (booksData) {
//
//                $("#books").html(" ");
//                $(".send-button").html(" ");
//                for (var i = 0; i < booksData.books.length; i++) {
//                    var book = booksData.books[i];
//                    if ((book.name.search(regex) != -1) || (book.author.search(regex) != -1)||(book.rating.search(regex) != -1)) {
//
//                        book = booksData.books[i];
//                        bookHub.mt(i, book);
//                        searchcount++;
//
//                    }
//                }
//                if(searchcount == 0)
//                {
//                    $("#books").html("<div class=noData>"+searchField+"  "+"have No Result</div>")
//                }
//
//
//            }
//        });
//
//    });
//
//
//    var bookHub = (function($){
//
//        //VARIABLES
//
//        var loader = $('<div class="loader"></div>'),
//            bookContent,
//            bookRowLayout,
//            bookCoulmnLayout,
//            bookLayout,
//            bookImageLayout,
//            bookContentLayout,
//            requestPending = true;
//
//        // METHODS
//
//        var initialize,
//            makeTimeout;
//
//        $('.detail-link').click(function(){
//            alert($(this).attr('href'));
//            //location.href= $(this).attr('href')+'.html';
//
//        });
//
//        makeTimeout = function(i,book){
//
//            setTimeout(function (){
//
//                bookRowLayout = $('<ul class="sidebar-book-list">');
//                    bookCoulmnLayout = $('<li class="group"></li>');
//
//                        bookContentLayout = $('<a href="detail.html?img='+book.image+'&img='+book.image+'&img='+book.image+'"><span class="img-wrap"><img src="'+book.image+'"></span><h5>'+book.name+'</h5><p class="sidebar-author">autor:'+book.author+'</p><p class="sidebar-views">'+book.price+'</p></a>');
//
//                bookCoulmnLayout.append(bookContentLayout);
//                bookRowLayout.append(bookCoulmnLayout);
//                $('#books').append(bookRowLayout);
//            },i*10);
//
//        };
//
//        //INIT method
//        initialize = function(){
//            /* Sidebar Menu */
//            $(".button-collapse").sideNav();
//
//
//            $.ajax('https://capillary.0x10.info/api/books?type=json&query=list_books',{
//
//                beforeSend:function(){
//                    $('#books').append(loader);
//
//                },
//                complete : function(){
//                    setTimeout(function() {
//                        requestPending = false;
//                        $('#books .loader').remove();
//                    }, 4500);
//                },
//                success : function(booksData){
//
//                    $(".send-button").html(parseInt(booksData.books.length));
//                    for (var i = 0; i < booksData.books.length; i++) {
//                        var book = booksData.books[i];
//                        makeTimeout (i, book);
//                    }
//                }
//
//            });
//
//        };
//        return {
//            init:initialize,
//            mt:makeTimeout
//        };
//
//    }(jQuery));
//
//    bookHub.init();
//});


$(document).ready(function(){

 //book-details

    $.ajax({
        type:"GET",
        url:"https://capillary.0x10.info/api/books?type=json&query=list_books",
        cache:false,
        dataType:"json",
        success:function(data){

            $("span.book-count").text(data.books.length);
            var bookTemplateScript = $('#book-template').html();
            var bookTemplate = Handlebars.compile(bookTemplateScript);

            var bookHtml = bookTemplate(data);

            $('.page-loader').addClass('hidden');
            $('.controls').removeClass('hidden');
            $('section > .row').html(bookHtml).find('div').last();

            // Instantiate MixItUp:
            $('#book-item-container').mixItUp();
            $('.book-item a').on('click',function(){

                var modalTemplateScript = $('#modal-template').html();
                var modalTemplate = Handlebars.compile(modalTemplateScript);

                var $this = $(this),
                    data = $this.parents('.book-item'),
                    templateData = {
                        name : data.find('h2[data-name]').data('name'),
                        price : data.find('p[data-price]').data('price'),
                        rating : data.find('p[data-rating]').data('rating'),
                        image : data.find('.book-image[data-image]').data('image'),
                        author : data.find('p[data-author]').data('author')
                    };

                var modalHtml = modalTemplate(templateData);
                $('.product-info').remove();
                $('#book-window > .fake-modal-wrapper').prepend(modalHtml);

                ////Like button click - Local Storage
                //$('.like-button').on('click',function(){
                //    var $this = $(this);
                //    var count=1;
                //    var key = $this.parents('#parcel-window').find('.product-info').data('uid');
                //    if(localStorage[key]){
                //        count += parseInt(localStorage[key]);
                //        localStorage[key] = count;
                //    }else{
                //        localStorage[key] = count;
                //    }
                //    $this.find('span.like-count').text(count);
                //});
                //
                //
                ////Like Count Init
                //var likes = getLikeCount($this.parents('.parcel-item').data('uid'));
                //if(likes){
                //    $('#parcel-window span.like-count').text(likes);
                //}else{
                //    $('#parcel-window span.like-count').text(0);
                //}
                //
                $('#book-window').toggleClass('hidden');
                $('.main').toggleClass('noscroll');
            });
        },
        error:function(xhr,status,error){

            $('span.book-count').text(0);

            $('.controls').addClass('hidden');
            $('.page-loader').addClass('hidden');
            $('.error-page').removeClass('hidden');

        }




    });
    $('html').on('click',function(){
        if($('.dropdown ul').is(':visible')){
            $('.dropdown ul').slideToggle();
        }
    });
    $('.dropdown a').on('click',function(e){
        $(this).next('ul').slideToggle();
        e.stopPropagation();
    });

    $("#search-input").on("keyup",function(){

        var $this = $(this);
        var query = $(this).val();
        searchBooks(query);

    });




    $('#book-window').on('click',function(){
        if($(this).is(':visible')){
            $(this).toggleClass('hidden');
            $('.main').toggleClass('noscroll');
        }
    });
    $('.fake-modal-wrapper').on('click',function(e){
        e.stopPropagation();
    });
    $('a.close-window').on('click',function(){
        $(this).parents('#book-window').toggleClass('hidden');
        $('.main').toggleClass('noscroll');
    });
    var infoVisible;
    function searchBooks(query){
        var searchSet = $('#book-item-container .book-item');

        searchSet.each(function(index){
            var name = $(this).data('name');
            var author = $(this).data('author');
            var price = $(this).data('price');

            if(name.indexOf(query) != -1 || author.indexOf(query) != -1 || price.indexOf(query) != -1 ){
                if(infoVisible){
                    $('.no-results').hide();
                    infoVisible = false;
                }
                $(this).fadeIn(100);
            }else{
                $(this).fadeOut(400);
            }
        });

        setTimeout(function(){
            if( ! searchSet.is(':visible')){
                $('.no-results').fadeIn(200);
                infoVisible = true;
            }
        },600);
    }


});






































