/// <reference path="./typings/main.d.ts" />

interface fsjetpack
{
    dir(path:string,options?:any);
}

interface Window
{
    jetpack:fsjetpack;
}
