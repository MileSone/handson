手动环节 

1.下载项目 

2.运行项目 

        a. npx webpack 
        b. npm run dev 

3.复习Code内容

4.打开ODA：Skill Handson  | CC - http://132.145.114.228:9089/components/     user Name: MyTestUser   password:MyTestPassword
	
        a.代码里打开CC/examples/loadUserContext.js
	
	b. 在ODA里建一个值，variables：      output: "string"
	
	c.ODA里查看下CC已经加载的CC
	
	d.ODA里在Flows里start上添加方法：
	

			LoadUserContext:
				component: "loadUserContext"
				properties:
					userName: "${name.value}" 
				transitions:
					next: "askNameEchotoUI"  
			askNameEchotoUI:
				component: "System.List"
				properties:
					prompt: "handson@+@${output.value}"
					options:
					- label: "确定"
						value: "yes"
						keyword: "接受,好,yes,ok"      
				transitions: 
					actions:
						yes: "yesBtn"
	
	

5.浏览器打开  localhost:9000  进行测试 

6.bot.js 243行打开注释代码
