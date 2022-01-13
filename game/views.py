from django.http import HttpResponse

def index(request):
    data="<h2 style='text-align:center'>Hello World</h2><h3 style='text-align:center'>Hello Tanggg --from lzq</h3>"
    return HttpResponse(data)


