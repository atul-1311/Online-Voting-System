const express = require('express')
const mysql = require('mysql')
const db = require('../../config/db');

function homeController(){
    return{
        index(req, res){
            res.render('home')
        },
        about(req, res){
            res.render('about')
        },
        contact(req, res){
            res.render('contact')
        }
    }
}

module.exports = homeController