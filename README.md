# Component Binding Bug

## Set-up
cd into components-test folder
`$ npm install`

cd into app-test folder
`$ npm link ../components-test`
`$ npm install`
`$ npm start`


  
### In reference to:
Git-hub aurelia/pal issue [Error invoking SVGAnalyzer](https://github.com/aurelia/pal/issues/19)

  
#### To get the error
Uncomment the `@bindable`'s in  
`components-test/src/forms/optemplate.js`    

```
aurelia-logging-console.js:54ERROR [app-router] Error: Error invoking SVGAnalyzer. Check the inner error for details.
------------------------------------------------
Inner Error:
Message: _aureliaPal.DOM.createElement is not a function
Inner Error Stack:
TypeError: _aureliaPal.DOM.createElement is not a function
    at createElement (http://localhost:9000/app.bundle.js:12194:29)
    at new SVGAnalyzer (http://localhost:9000/app.bundle.js:12202:9)
    at Object.invoke (http://localhost:9000/aurelia-bootstrap.bundle.js:8649:12)
    at InvocationHandler.invoke (http://localhost:9000/aurelia-bootstrap.bundle.js:8626:166)
    at Container.invoke (http://localhost:9000/aurelia-bootstrap.bundle.js:8879:23)
    at StrategyResolver.get (http://localhost:9000/aurelia-bootstrap.bundle.js:8354:35)
    at Container.get (http://localhost:9000/aurelia-bootstrap.bundle.js:8812:39)
    at Object.invoke (http://localhost:9000/aurelia-bootstrap.bundle.js:8679:103)
    at InvocationHandler.invoke (http://localhost:9000/aurelia-bootstrap.bundle.js:8626:166)
    at Container.invoke (http://localhost:9000/aurelia-bootstrap.bundle.js:8879:23)
    at StrategyResolver.get (http://localhost:9000/aurelia-bootstrap.bundle.js:8354:35)
    at Container.get (http://localhost:9000/aurelia-bootstrap.bundle.js:8812:39)
    at HtmlBehaviorResource.initialize (http://localhost:9000/app.bundle.js:4390:38)
    at ResourceDescription.initialize (http://localhost:9000/aurelia-bootstrap.bundle.js:23911:19)
    at ResourceModule.initialize (http://localhost:9000/aurelia-bootstrap.bundle.js:23832:15)
    at http://localhost:9000/aurelia-bootstrap.bundle.js:24210:18
End Inner Error Stack>
```