手动环节 

1.下载项目 

2.运行项目 

        a. npx webpack 
        b. npm run dev 

3.复习连接

4.打开ODA：Skill Handson
	
        a.代码里打开CC/examples/loadUserContext.js
	
	b. 在ODA里建一个值，variables：      output: "string"
	
	c.ODA里查看下CC已经加载的CC
	
	d.ODA里在Flows里start上添加方法：
	  LoadUserContext:
    		component: "loadUserContext"
    		properties:
      		userName: "${name.value}" 
    		transitions:
      		next: "start"

5.浏览器打开  localhost:9000  进行测试 
