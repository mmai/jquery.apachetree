jquery.apachetree
=================

Get the content of an Apache Directory Index

Usage 
-----

```javascript
 $.getApacheTree('yourbrowseabledirectory/').done(
   function(data){
     // Do something with data
   }
 );
```

Returns something like :
```javascript
[
  {
    file: "afile.txt",
    href: "yourbrowseabledirectory/afile.txt"
  },
  {
    file: "anotherfile.txt",
    href: "yourbrowseabledirectory/anotherfile.txt"
  },
  {
    file: "subdirectory/",
    href: "yourbrowseabledirectory/subdirectory/"
    nodes: [
      {
        file: "lorem.csv",
        href: "yourbrowseabledirectory/subdirectory/lorem.csv"
      },
      {
        file: "ipsum.png",
        href: "yourbrowseabledirectory/subdirectory/ipsum.png"
      }
    ]
  }
]
```
